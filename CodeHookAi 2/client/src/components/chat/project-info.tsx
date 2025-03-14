import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";

interface ProjectInfoProps {
  project?: Project;
  onProjectUpdate: () => void;
}

export function ProjectInfo({ project, onProjectUpdate }: ProjectInfoProps) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const { toast } = useToast();

  const updateProject = useMutation({
    mutationFn: async () => {
      const method = project ? 'PATCH' : 'POST';
      const url = project ? `/api/projects/${project.id}` : '/api/projects';
      const response = await apiRequest(method, url, { name, description });
      return response.json();
    },
    onSuccess: () => {
      onProjectUpdate();
      toast({
        title: "Success",
        description: "Project information updated"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update project: " + error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-semibold">Project Information</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Project Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              rows={5}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => updateProject.mutate()}
            disabled={updateProject.isPending || !name.trim()}
          >
            {updateProject.isPending ? "Updating..." : "Update Project"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
