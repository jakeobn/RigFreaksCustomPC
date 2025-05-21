import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, ArrowLeft, FileText } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { allComponents, PCComponentData } from '@/lib/componentData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'wouter';

export default function ComponentBackupPage() {
  const [isCopied, setIsCopied] = useState(false);
  const [isCsvCopied, setIsCsvCopied] = useState(false);
  const [showCsvContent, setShowCsvContent] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Generate the current components data as JSON
  const generateComponentsJson = (): string => {
    try {
      // Add timestamp to the data
      const dataWithTimestamp = {
        components: allComponents,
        lastUpdated: Date.now()
      };

      // Format with indentation for readability
      return JSON.stringify(dataWithTimestamp, null, 2);
    } catch (error) {
      console.error('Error generating components JSON:', error);
      return JSON.stringify({ error: 'Failed to generate components data' });
    }
  };

  // Copy JSON to clipboard
  const copyToClipboard = () => {
    try {
      const json = generateComponentsJson();
      navigator.clipboard.writeText(json);
      setIsCopied(true);

      toast({
        title: "Copied to Clipboard",
        description: "Components data has been copied to your clipboard",
      });

      // Reset copy state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy data to clipboard",
        variant: "destructive",
      });
    }
  };

  // Download JSON as a file
  const downloadJson = () => {
    try {
      const json = generateComponentsJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create a link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `rigfreaks-components-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "Components data downloaded as JSON file",
      });
    } catch (error) {
      console.error('Error downloading JSON:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download components data",
        variant: "destructive",
      });
    }
  };

  // Generate CSV data for all components
  const generateCsvData = (): string => {
    try {
      // Headers for the CSV
      const headers = [
        'Category',
        'ID',
        'Name',
        'Price',
        'Description',
        'Image URL',
        'Inventory Status',
        'Stock Quantity',
        'Specifications'
      ].join('\t');

      // Rows for each component
      const rows: string[] = [];

      // Process each category and component
      Object.keys(allComponents).forEach(category => {
        if (!allComponents[category] || !Array.isArray(allComponents[category])) return;

        allComponents[category].forEach((component: PCComponentData) => {
          // Handle specifications - strip HTML tags and truncate if needed
          let specs = '';
          if (component.specsHtml) {
            // Use HTML specs if available
            specs = component.specsHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          } else if (component.specs) {
            // Otherwise convert specs object to string
            specs = Object.entries(component.specs)
              .map(([key, value]) => `${key}: ${value}`)
              .join('; ');
          }

          // Truncate if too long
          if (specs.length > 100) {
            specs = specs.substring(0, 100) + '...';
          }

          // Create row with all fields
          const row = [
            category,
            component.id || '',
            component.name || '',
            component.price?.toString() || '',
            component.description || '',
            component.image || '',
            component.inventoryStatus || 'In Stock', // Default to In Stock
            component.stockQuantity?.toString() || '',
            specs
          ].map(field => {
            // Wrap fields with tabs or newlines in quotes
            if (field.includes('\t') || field.includes('\n')) {
              return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
          }).join('\t');

          rows.push(row);
        });
      });

      // Combine headers and rows
      return [headers, ...rows].join('\n');
    } catch (error) {
      console.error('Error generating CSV data:', error);
      return 'Error generating CSV data';
    }
  };

  // Show CSV/TSV content for copying on mobile devices
  const showCsvForCopy = () => {
    try {
      const csv = generateCsvData();
      setCsvContent(csv);
      setShowCsvContent(true);

      toast({
        title: "CSV Data Ready",
        description: "CSV data is now displayed below for copying",
      });
    } catch (error) {
      console.error('Error generating CSV for display:', error);
      toast({
        title: "CSV Generation Failed",
        description: "Failed to generate CSV data for display",
        variant: "destructive",
      });
    }
  };

  // Copy CSV content to clipboard
  const copyCsvToClipboard = () => {
    try {
      navigator.clipboard.writeText(csvContent);
      setIsCsvCopied(true);

      toast({
        title: "CSV Copied to Clipboard",
        description: "TSV/CSV data has been copied to your clipboard",
      });

      // Reset copy state after 2 seconds
      setTimeout(() => {
        setIsCsvCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying CSV to clipboard:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy data to clipboard",
        variant: "destructive",
      });
    }
  };

  // Download components as CSV file (keeping for desktop)
  const downloadCsv = () => {
    try {
      const csv = generateCsvData();
      const blob = new Blob([csv], { type: 'text/tab-separated-values' });
      const url = URL.createObjectURL(blob);

      // Create a link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `rigfreaks-components-${new Date().toISOString().slice(0, 10)}.tsv`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "CSV Download Complete",
        description: "Components data downloaded as TSV file",
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "CSV Download Failed",
        description: "Failed to download components data as CSV",
        variant: "destructive",
      });
    }
  };

  // Count the number of components in each category
  const countComponents = (): { total: number, categories: number } => {
    let total = 0;
    let categoriesWithComponents = 0;

    Object.keys(allComponents).forEach(category => {
      if (allComponents[category] && allComponents[category].length > 0) {
        total += allComponents[category].length;
        categoriesWithComponents++;
      }
    });

    return { total, categories: categoriesWithComponents };
  };

  const backupComponents = async () => {
    setIsBackingUp(true);
    try {
      const response = await fetch('/api/components/backup', {
        method: 'POST'
      });
      if (response.ok) {
        toast({
          title: "Backup Complete",
          description: "Successfully backed up components to local storage"
        });
      }
    } catch (error) {
      console.error('Error backing up components:', error);
      toast({
        title: "Backup Failed", 
        description: "Failed to backup components",
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const { total, categories } = countComponents();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Component Data Backup</h1>
        <Link href="/admin/components">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Components
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Backup Your Component Data</h2>
        <p className="text-muted-foreground mb-4">
          Create a backup of all your component data. This backup can be used to restore your components if needed.
        </p>

        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 mb-6">
          <AlertTitle className="text-blue-800 dark:text-blue-300">Component Summary</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            Found {total} components across {categories} categories
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Component Data (JSON format)</h3>
          <Textarea
            value={generateComponentsJson()}
            readOnly
            className="h-96 font-mono text-xs mb-4"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={copyToClipboard} className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
          <Button onClick={downloadJson} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download JSON
          </Button>
          <Button onClick={showCsvForCopy} variant="outline" className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-500/20">
            <FileText className="h-4 w-4" />
            Show CSV Data
          </Button>
        </div>

        {/* CSV Content Display for Mobile */}
        {showCsvContent && (
          <div className="bg-card rounded-lg border shadow-sm p-6 mt-6">
            <h3 className="font-medium mb-2">CSV/TSV Data</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              This is your component data in tab-separated format (TSV/CSV). You can copy and paste it into a spreadsheet application.
            </p>

            <Textarea
              value={csvContent}
              readOnly
              className="h-60 font-mono text-xs mb-4"
            />

            <Button onClick={copyCsvToClipboard} className="flex items-center gap-2 w-full">
              <Copy className="h-4 w-4" />
              {isCsvCopied ? 'Copied!' : 'Copy CSV Data'}
            </Button>
          </div>
        )}
      </div>
      <Button onClick={backupComponents} disabled={isBackingUp}>
        {isBackingUp ? "Backing Up..." : "Backup Components"}
      </Button>
    </div>
  );
}