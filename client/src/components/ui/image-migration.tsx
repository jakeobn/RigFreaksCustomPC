import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export function ImageMigration() {
  const { toast } = useToast();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [migrationProgress, setMigrationProgress] = useState(0);

  const migrateImages = async () => {
    try {
      setIsMigrating(true);
      setMigrationError(null);
      setMigrationProgress(10);

      toast({
        title: "Migration Started",
        description: "Starting to migrate images to local storage. This may take a few minutes."
      });

      const response = await fetch('/api/images/migrate', {
        method: 'POST'
      });

      setMigrationProgress(50);

      if (!response.ok) {
        throw new Error(`Migration failed with status: ${response.status}`);
      }

      const result = await response.json();

      setMigrationProgress(90);

      if (result.success) {
        setMigrationComplete(true);
        setMigrationProgress(100);
        toast({
          title: "Migration Complete",
          description: "All images have been successfully migrated to local storage."
        });
      } else {
        throw new Error(result.message || 'Migration failed');
      }
    } catch (error) {
      setMigrationError(error instanceof Error ? error.message : 'Unknown error during migration');
      setMigrationProgress(0);
      toast({
        title: "Migration Failed",
        description: error instanceof Error ? error.message : 'Failed to migrate images',
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Migration Utility</CardTitle>
        <CardDescription>
          Migrate component images to local storage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={migrationProgress} />
          {migrationError && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{migrationError}</span>
            </div>
          )}
          {migrationComplete && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <span>Migration completed successfully</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={migrateImages} 
          disabled={isMigrating}
          className="w-full"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : (
            <>
              <HardDrive className="mr-2 h-4 w-4" />
              Start Migration
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}