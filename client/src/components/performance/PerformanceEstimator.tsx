import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  calculatePerformanceScore, 
  estimateGameFps, 
  getGameRecommendations, 
  getPerformanceSummary,
  games,
  performanceUseCase,
  findClosestCpuMatch,
  findClosestGpuMatch,
  cpuBenchmarks,
  gpuBenchmarks,
  getCpuUserBenchmark,
  getGpuUserBenchmark,
  getStorageUserBenchmark,
  getRamUserBenchmark
} from '@shared/benchmarks';
import { 
  Gamepad2, 
  HardDrive, 
  Layers, 
  Cpu, 
  Monitor, 
  BarChart, 
  Zap, 
  CpuIcon, 
  ChevronRight, 
  Clock, 
  Award,
  Microchip,
  AlertTriangle
} from 'lucide-react';

interface PerformanceEstimatorProps {
  components: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    [key: string]: string | undefined;
  };
}

interface ComponentMatch {
  cpu: {
    matchedModel: string | null;
    benchScore: number;
    cores: number;
    threads: number;
    ubm?: {
      score: number;
      rank: number;
      samples: number;
      percentile?: number;
    };
  };
  gpu: {
    matchedModel: string | null;
    benchScore: number;
    vram: number;
    ubm?: {
      score: number;
      rank: number;
      samples: number;
      percentile?: number;
    };
  };
  ram?: {
    ubm?: {
      score: number;
      rank: number;
      samples: number;
      percentile?: number;
    };
  };
  storage?: {
    ubm?: {
      score: number;
      rank: number;
      samples: number;
      percentile?: number;
      type?: string;
      subtype?: string;
    };
  };
}

const PerformanceEstimator: React.FC<PerformanceEstimatorProps> = ({ components }) => {
  const [selectedGame, setSelectedGame] = useState<string>(Object.keys(games)[0]);
  const [selectedResolution, setSelectedResolution] = useState<string>("1080p");
  const [performanceSummary, setPerformanceSummary] = useState<any>(null);
  const [gameRecommendations, setGameRecommendations] = useState<any[]>([]);
  const [currentFps, setCurrentFps] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [componentMatch, setComponentMatch] = useState<ComponentMatch>({
    cpu: { matchedModel: null, benchScore: 0, cores: 0, threads: 0 },
    gpu: { matchedModel: null, benchScore: 0, vram: 0 }
  });
  
  // Update performance metrics when components change
  useEffect(() => {
    try {
      if (Object.keys(components).length > 0) {
        // Make sure we have valid data before calling performance functions
        const validComponents = {
          ...components,
          cpu: components.cpu || undefined,
          gpu: components.gpu || undefined,
          ram: components.ram || undefined,
          storage: components.storage || undefined
        };

        // Only proceed if we have at least one valid component
        if (validComponents.cpu || validComponents.gpu) {
          const summary = getPerformanceSummary(validComponents);
          setPerformanceSummary(summary);
          
          const recommendations = getGameRecommendations(validComponents);
          setGameRecommendations(recommendations);
          
          const fps = estimateGameFps(validComponents, selectedGame as keyof typeof games, selectedResolution);
          setCurrentFps(fps);
          
          // Find matching CPU and GPU models
          const cpuModel = validComponents.cpu ? findClosestCpuMatch(validComponents.cpu) : null;
          const gpuModel = validComponents.gpu ? findClosestGpuMatch(validComponents.gpu) : null;
          
          // Get UserBenchmark data
          const cpuUbm = validComponents.cpu ? getCpuUserBenchmark(validComponents.cpu) : null;
          const gpuUbm = validComponents.gpu ? getGpuUserBenchmark(validComponents.gpu) : null;
          const ramUbm = validComponents.ram ? getRamUserBenchmark(validComponents.ram) : null;
          const storageUbm = validComponents.storage ? getStorageUserBenchmark(validComponents.storage) : null;
          
          // Create component match data with both our benchmark and UserBenchmark data
          const newComponentMatch: ComponentMatch = {
            cpu: {
              matchedModel: cpuModel,
              benchScore: cpuModel && (cpuBenchmarks as any)[cpuModel] ? (cpuBenchmarks as any)[cpuModel].score : 0,
              cores: cpuModel && (cpuBenchmarks as any)[cpuModel] ? (cpuBenchmarks as any)[cpuModel].cores : 0,
              threads: cpuModel && (cpuBenchmarks as any)[cpuModel] ? (cpuBenchmarks as any)[cpuModel].threads : 0,
            },
            gpu: {
              matchedModel: gpuModel,
              benchScore: gpuModel && (gpuBenchmarks as any)[gpuModel] ? (gpuBenchmarks as any)[gpuModel].score : 0,
              vram: gpuModel && (gpuBenchmarks as any)[gpuModel] ? (gpuBenchmarks as any)[gpuModel].vram : 0,
            }
          };
          
          // Add UserBenchmark data if available
          if (cpuUbm) {
            newComponentMatch.cpu.ubm = {
              score: cpuUbm.score,
              rank: cpuUbm.rank,
              samples: cpuUbm.samples,
              percentile: Math.min(99, Math.max(1, 100 - (cpuUbm.rank / 150) * 100))
            };
          }
          
          if (gpuUbm) {
            newComponentMatch.gpu.ubm = {
              score: gpuUbm.score,
              rank: gpuUbm.rank,
              samples: gpuUbm.samples,
              percentile: Math.min(99, Math.max(1, 100 - (gpuUbm.rank / 150) * 100))
            };
          }
          
          if (ramUbm) {
            newComponentMatch.ram = {
              ubm: {
                score: ramUbm.score,
                rank: ramUbm.rank,
                samples: ramUbm.samples,
                percentile: Math.min(99, Math.max(1, 100 - (ramUbm.rank / 45) * 100))
              }
            };
          }
          
          if (storageUbm) {
            const ubmData = {
              score: storageUbm.score,
              rank: storageUbm.rank,
              samples: storageUbm.samples,
              percentile: Math.min(99, Math.max(1, 100 - (storageUbm.rank / 300) * 100))
            };
            
            // Determine storage type from score
            if (storageUbm.score > 120) {
              newComponentMatch.storage = {
                ubm: {
                  ...ubmData,
                  type: "SSD",
                  subtype: storageUbm.score > 300 ? "NVMe" : "SATA"
                }
              };
            } else {
              newComponentMatch.storage = {
                ubm: {
                  ...ubmData,
                  type: "HDD"
                }
              };
            }
          }
          
          setComponentMatch(newComponentMatch);
        }
      }
    } catch (error) {
      console.error("Error in performance estimator:", error);
    }
  }, [components, selectedGame, selectedResolution]);

  // Get color based on performance score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-yellow-500";
    if (score >= 30) return "text-orange-500";
    return "text-red-500";
  };

  // Get color based on FPS
  const getFpsColor = (fps: number) => {
    if (fps >= 144) return "text-green-500";
    if (fps >= 100) return "text-emerald-500";
    if (fps >= 60) return "text-yellow-500";
    if (fps >= 30) return "text-orange-500";
    return "text-red-500";
  };

  // Get color for progress bar
  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-emerald-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  if (!components.cpu && !components.gpu) {
    return (
      <Card className="mt-6 bg-dark-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Performance Estimator
          </CardTitle>
          <CardDescription>
            Select CPU and GPU components to see performance estimates
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          Add components to your build to see performance estimates
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 bg-dark-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Performance Estimator
        </CardTitle>
        <CardDescription>
          Estimated performance for your build
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <BarChart className="h-4 w-4 mr-2 hidden sm:inline" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="gaming" className="text-xs sm:text-sm">
              <Gamepad2 className="h-4 w-4 mr-2 hidden sm:inline" />
              Gaming
            </TabsTrigger>
            <TabsTrigger value="hardware" className="text-xs sm:text-sm">
              <CpuIcon className="h-4 w-4 mr-2 hidden sm:inline" />
              Hardware
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs sm:text-sm">
              <Award className="h-4 w-4 mr-2 hidden sm:inline" />
              Recommendations
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {performanceSummary && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <span className="text-2xl font-bold">
                    {performanceSummary.overall}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">/ 100</span>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-1">
                        <Gamepad2 className="h-4 w-4" /> Gaming
                      </Label>
                      <span className={getScoreColor(performanceSummary.gaming.score)}>
                        {performanceSummary.gaming.score}/100 - {performanceSummary.gaming.rating}
                      </span>
                    </div>
                    <Progress 
                      value={performanceSummary.gaming.score} 
                      className={`h-2 ${getProgressColor(performanceSummary.gaming.score)}`} 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-1">
                        <Layers className="h-4 w-4" /> Content Creation
                      </Label>
                      <span className={getScoreColor(performanceSummary.contentCreation.score)}>
                        {performanceSummary.contentCreation.score}/100 - {performanceSummary.contentCreation.rating}
                      </span>
                    </div>
                    <Progress 
                      value={performanceSummary.contentCreation.score} 
                      className={`h-2 ${getProgressColor(performanceSummary.contentCreation.score)}`} 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-1">
                        <HardDrive className="h-4 w-4" /> Office & Productivity
                      </Label>
                      <span className={getScoreColor(performanceSummary.office.score)}>
                        {performanceSummary.office.score}/100 - {performanceSummary.office.rating}
                      </span>
                    </div>
                    <Progress 
                      value={performanceSummary.office.score} 
                      className={`h-2 ${getProgressColor(performanceSummary.office.score)}`} 
                    />
                  </div>
                </div>
                
                <div className="bg-card/50 rounded-lg p-4 text-sm">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    System Assessment
                  </h4>
                  <p>
                    {performanceSummary.overall >= 90 ? 'Powerhouse configuration. Exceptional performance across all tasks and games.' :
                      performanceSummary.overall >= 80 ? 'High-end system. Great for demanding games and content creation tasks.' :
                      performanceSummary.overall >= 70 ? 'Strong performer for gaming and most productivity tasks.' :
                      performanceSummary.overall >= 60 ? 'Balanced system suitable for mainstream gaming and everyday tasks.' :
                      performanceSummary.overall >= 50 ? 'Mid-range system. Capable for casual gaming and general productivity.' :
                      performanceSummary.overall >= 40 ? 'Entry-level system. Suitable for light gaming and basic tasks.' :
                      'Basic system. Best suited for everyday computing tasks and web browsing.'}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Gaming Tab */}
          <TabsContent value="gaming" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Selected Game</Label>
                <Select
                  value={selectedGame}
                  onValueChange={setSelectedGame}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(games).map((game) => (
                      <SelectItem key={game} value={game}>
                        {games[game as keyof typeof games].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select
                  value={selectedResolution}
                  onValueChange={setSelectedResolution}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="1440p">1440p (Quad HD)</SelectItem>
                    <SelectItem value="4K">4K (Ultra HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 text-center">
                <div className="flex justify-center items-baseline gap-1">
                  <span className={`text-3xl font-bold ${getFpsColor(currentFps)}`}>
                    {currentFps}
                  </span>
                  <span className="text-sm text-muted-foreground">FPS</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {games[selectedGame as keyof typeof games]?.name} at {selectedResolution}
                </p>
                
                <div className="mt-2">
                  <div className="inline-block px-2 py-1 rounded-md text-xs" 
                       style={{ backgroundColor: getFpsColor(currentFps) + '20' }}>
                    {currentFps >= 144 ? 'Excellent Performance' :
                      currentFps >= 100 ? 'Very Good Performance' :
                      currentFps >= 60 ? 'Good Performance' :
                      currentFps >= 30 ? 'Playable' : 'Poor Performance'}
                  </div>
                </div>
              </div>
              
              <div className="bg-card/50 rounded-lg p-4 mt-4 text-sm">
                <h4 className="font-medium mb-2">Game Analysis</h4>
                <p>
                  {currentFps >= 144 ? `Your system can run ${games[selectedGame as keyof typeof games]?.name} at ${selectedResolution} with exceptional framerates. You'll experience ultra-smooth gameplay with no performance issues.` :
                    currentFps >= 100 ? `Your system handles ${games[selectedGame as keyof typeof games]?.name} at ${selectedResolution} very well. You'll enjoy smooth gameplay with consistent framerates.` :
                    currentFps >= 60 ? `Your system can run ${games[selectedGame as keyof typeof games]?.name} at ${selectedResolution} at playable framerates. You should have a good gaming experience.` :
                    currentFps >= 30 ? `Your system meets the minimum requirements for ${games[selectedGame as keyof typeof games]?.name} at ${selectedResolution}. You may experience occasional frame drops.` :
                    `Your system may struggle with ${games[selectedGame as keyof typeof games]?.name} at ${selectedResolution}. Consider lowering settings or resolution for better performance.`}
                </p>
                {currentFps < 60 && (
                  <div className="mt-2">
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                      Recommendation: {currentFps < 30 ? 'Lower resolution or settings' : 'Consider upgrading GPU for better performance'}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-2 bg-card/50 rounded-lg">
                  <div className={`text-xl font-bold ${getFpsColor(estimateGameFps(components, selectedGame as keyof typeof games, "1080p"))}`}>
                    {estimateGameFps(components, selectedGame as keyof typeof games, "1080p")}
                  </div>
                  <div className="text-xs text-muted-foreground">1080p</div>
                </div>
                <div className="text-center p-2 bg-card/50 rounded-lg">
                  <div className={`text-xl font-bold ${getFpsColor(estimateGameFps(components, selectedGame as keyof typeof games, "1440p"))}`}>
                    {estimateGameFps(components, selectedGame as keyof typeof games, "1440p")}
                  </div>
                  <div className="text-xs text-muted-foreground">1440p</div>
                </div>
                <div className="text-center p-2 bg-card/50 rounded-lg">
                  <div className={`text-xl font-bold ${getFpsColor(estimateGameFps(components, selectedGame as keyof typeof games, "4K"))}`}>
                    {estimateGameFps(components, selectedGame as keyof typeof games, "4K")}
                  </div>
                  <div className="text-xs text-muted-foreground">4K</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Hardware Tab */}
          <TabsContent value="hardware" className="space-y-4">
            <div className="space-y-4">
              {/* CPU Info */}
              <div className="bg-card/50 rounded-lg p-4">
                <h4 className="font-medium flex items-center mb-3">
                  <Cpu className="h-4 w-4 mr-2" />
                  CPU Specifications
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Model</div>
                    <div className="text-sm font-medium">{componentMatch.cpu.matchedModel || "N/A"}</div>
                  </div>
                  
                  {/* Show UserBenchmark data if available */}
                  {componentMatch.cpu.ubm ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">UserBenchmark Score</div>
                        <div className="text-sm font-medium flex items-center">
                          {componentMatch.cpu.ubm.score.toFixed(1)} 
                          <Badge className="ml-2 text-xs" variant="outline">
                            Rank #{componentMatch.cpu.ubm.rank}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Percentile</div>
                        <div className="text-sm font-medium flex items-center">
                          <span className={getScoreColor(componentMatch.cpu.ubm.percentile || 0)}>
                            {componentMatch.cpu.ubm.percentile?.toFixed(0)}%
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            (better than {componentMatch.cpu.ubm.percentile?.toFixed(0)}% of CPUs)
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Sample Size</div>
                        <div className="text-sm font-medium">{componentMatch.cpu.ubm.samples.toLocaleString()} systems</div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Benchmark Score</div>
                      <div className="text-sm font-medium">{componentMatch.cpu.benchScore.toLocaleString()}</div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Cores / Threads</div>
                    <div className="text-sm font-medium">{componentMatch.cpu.cores} / {componentMatch.cpu.threads}</div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-1">Performance Rating</div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(componentMatch.cpu.ubm ? componentMatch.cpu.ubm.percentile || 0 : Math.min(100, componentMatch.cpu.benchScore / 300))}`}
                        style={{ width: `${componentMatch.cpu.ubm ? componentMatch.cpu.ubm.percentile || 0 : Math.min(100, componentMatch.cpu.benchScore / 300)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Entry-level</span>
                      <span>Mid-range</span>
                      <span>High-end</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* GPU Info */}
              <div className="bg-card/50 rounded-lg p-4">
                <h4 className="font-medium flex items-center mb-3">
                  <Monitor className="h-4 w-4 mr-2" />
                  GPU Specifications
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Model</div>
                    <div className="text-sm font-medium">{componentMatch.gpu.matchedModel || "N/A"}</div>
                  </div>
                  
                  {/* Show UserBenchmark data if available */}
                  {componentMatch.gpu.ubm ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">UserBenchmark Score</div>
                        <div className="text-sm font-medium flex items-center">
                          {componentMatch.gpu.ubm.score.toFixed(1)} 
                          <Badge className="ml-2 text-xs" variant="outline">
                            Rank #{componentMatch.gpu.ubm.rank}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Percentile</div>
                        <div className="text-sm font-medium flex items-center">
                          <span className={getScoreColor(componentMatch.gpu.ubm.percentile || 0)}>
                            {componentMatch.gpu.ubm.percentile?.toFixed(0)}%
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            (better than {componentMatch.gpu.ubm.percentile?.toFixed(0)}% of GPUs)
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Sample Size</div>
                        <div className="text-sm font-medium">{componentMatch.gpu.ubm.samples.toLocaleString()} systems</div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Benchmark Score</div>
                      <div className="text-sm font-medium">{componentMatch.gpu.benchScore.toLocaleString()}</div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">VRAM</div>
                    <div className="text-sm font-medium">{componentMatch.gpu.vram > 0 ? `${componentMatch.gpu.vram} GB` : "Integrated"}</div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-1">Performance Rating</div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(componentMatch.gpu.ubm ? componentMatch.gpu.ubm.percentile || 0 : Math.min(100, componentMatch.gpu.benchScore / 450))}`}
                        style={{ width: `${componentMatch.gpu.ubm ? componentMatch.gpu.ubm.percentile || 0 : Math.min(100, componentMatch.gpu.benchScore / 450)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Entry-level</span>
                      <span>Mid-range</span>
                      <span>High-end</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* RAM Info - Only show if available */}
              {componentMatch.ram && componentMatch.ram.ubm && (
                <div className="bg-card/50 rounded-lg p-4">
                  <h4 className="font-medium flex items-center mb-3">
                    <Microchip className="h-4 w-4 mr-2" />
                    RAM Specifications
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">UserBenchmark Score</div>
                      <div className="text-sm font-medium flex items-center">
                        {componentMatch.ram.ubm.score.toFixed(1)} 
                        <Badge className="ml-2 text-xs" variant="outline">
                          Rank #{componentMatch.ram.ubm.rank}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Percentile</div>
                      <div className="text-sm font-medium flex items-center">
                        <span className={getScoreColor(componentMatch.ram.ubm.percentile || 0)}>
                          {componentMatch.ram.ubm.percentile?.toFixed(0)}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          (better than {componentMatch.ram.ubm.percentile?.toFixed(0)}% of RAM)
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Sample Size</div>
                      <div className="text-sm font-medium">{componentMatch.ram.ubm.samples.toLocaleString()} systems</div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-sm text-muted-foreground mb-1">Performance Rating</div>
                      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(componentMatch.ram.ubm.percentile || 0)}`}
                          style={{ width: `${componentMatch.ram.ubm.percentile || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Entry-level</span>
                        <span>Mid-range</span>
                        <span>High-end</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Storage Info - Only show if available */}
              {componentMatch.storage && componentMatch.storage.ubm && (
                <div className="bg-card/50 rounded-lg p-4">
                  <h4 className="font-medium flex items-center mb-3">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Storage Specifications
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="text-sm font-medium">
                        {componentMatch.storage.ubm.type}
                        {componentMatch.storage.ubm.subtype && ` (${componentMatch.storage.ubm.subtype})`}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">UserBenchmark Score</div>
                      <div className="text-sm font-medium flex items-center">
                        {componentMatch.storage.ubm.score.toFixed(1)} 
                        <Badge className="ml-2 text-xs" variant="outline">
                          Rank #{componentMatch.storage.ubm.rank}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Percentile</div>
                      <div className="text-sm font-medium flex items-center">
                        <span className={getScoreColor(componentMatch.storage.ubm.percentile || 0)}>
                          {componentMatch.storage.ubm.percentile?.toFixed(0)}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          (better than {componentMatch.storage.ubm.percentile?.toFixed(0)}% of storage devices)
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Sample Size</div>
                      <div className="text-sm font-medium">{componentMatch.storage.ubm.samples.toLocaleString()} systems</div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-sm text-muted-foreground mb-1">Performance Rating</div>
                      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(componentMatch.storage.ubm.percentile || 0)}`}
                          style={{ width: `${componentMatch.storage.ubm.percentile || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>HDD</span>
                        <span>SATA SSD</span>
                        <span>NVMe SSD</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* System Balance */}
              <div className="bg-card/50 rounded-lg p-4">
                <h4 className="font-medium flex items-center mb-3">
                  <BarChart className="h-4 w-4 mr-2" />
                  System Balance
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CPU-GPU Balance</span>
                    <Badge variant="outline" className={
                      Math.abs((componentMatch.cpu.benchScore / 300) - (componentMatch.gpu.benchScore / 450)) < 0.2
                        ? "border-green-500 text-green-500"
                        : "border-yellow-500 text-yellow-500"
                    }>
                      {Math.abs((componentMatch.cpu.benchScore / 300) - (componentMatch.gpu.benchScore / 450)) < 0.2
                        ? "Well Balanced"
                        : componentMatch.cpu.benchScore / 300 > componentMatch.gpu.benchScore / 450
                          ? "CPU Stronger"
                          : "GPU Stronger"
                      }
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.abs((componentMatch.cpu.benchScore / 300) - (componentMatch.gpu.benchScore / 450)) < 0.2
                      ? "Your CPU and GPU are well-matched, providing balanced performance for most tasks."
                      : componentMatch.cpu.benchScore / 300 > componentMatch.gpu.benchScore / 450
                        ? "Your CPU is relatively stronger than your GPU. For gaming, consider a GPU upgrade to better balance the system."
                        : "Your GPU is relatively stronger than your CPU. For gaming, you might experience CPU bottlenecking in CPU-intensive games."
                    }
                  </p>
                  
                  {/* Show storage bottleneck warning if applicable */}
                  {componentMatch.storage && componentMatch.storage.ubm && 
                   componentMatch.storage.ubm.type === "HDD" && 
                   (componentMatch.cpu.ubm?.percentile || 0) > 60 && 
                   (componentMatch.gpu.ubm?.percentile || 0) > 60 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center text-yellow-500">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Storage Bottleneck Detected</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your system is using a mechanical hard drive (HDD) with higher-end CPU/GPU components. 
                        Consider upgrading to an SSD for significantly improved system responsiveness and game loading times.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Game Recommendations</h4>
              <div className="space-y-3">
                {gameRecommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-card/50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{rec.game}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className={getFpsColor(rec.performance["1080p"].fps)}>
                          {rec.performance["1080p"].fps} FPS @ 1080p
                        </span>
                        <span className={getFpsColor(rec.performance["1440p"].fps)}>
                          {rec.performance["1440p"].fps} FPS @ 1440p
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-md"
                         style={{ backgroundColor: getFpsColor(rec.performance[selectedResolution].fps) + '20' }}>
                      {rec.performance[selectedResolution].rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-3">Potential Upgrades</h4>
              <div className="space-y-3">
                {componentMatch.cpu.benchScore / 300 < componentMatch.gpu.benchScore / 450 && (
                  <div className="p-3 rounded-lg bg-card/50">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-blue-500" />
                      <h5 className="text-sm font-medium">CPU Upgrade Recommended</h5>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your CPU is relatively weaker than your GPU. Consider upgrading to a more powerful CPU for better balance.
                    </p>
                    <div className="mt-2">
                      <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 hover:bg-blue-500/30">
                        Potential bottleneck in CPU-intensive games
                      </Badge>
                    </div>
                  </div>
                )}
                
                {componentMatch.gpu.benchScore / 450 < componentMatch.cpu.benchScore / 300 && (
                  <div className="p-3 rounded-lg bg-card/50">
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-2 text-green-500" />
                      <h5 className="text-sm font-medium">GPU Upgrade Recommended</h5>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your GPU is relatively weaker than your CPU. For better gaming performance, consider a GPU upgrade.
                    </p>
                    <div className="mt-2">
                      <Badge className="bg-green-500/20 text-green-500 border-green-500 hover:bg-green-500/30">
                        Potential for higher frame rates with a better GPU
                      </Badge>
                    </div>
                  </div>
                )}
                
                {/* General recommendations based on overall score */}
                {performanceSummary && performanceSummary.overall < 70 && (
                  <div className="p-3 rounded-lg bg-card/50">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                      <h5 className="text-sm font-medium">General System Improvements</h5>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {performanceSummary.overall < 50 
                        ? "Consider upgrading both CPU and GPU for a significant performance boost across all applications."
                        : "Your system would benefit from targeted component upgrades to improve overall performance."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <p>Note: Performance estimates are based on typical performance and may vary based on specific hardware configurations and software settings.</p>
      </CardFooter>
    </Card>
  );
};

export default PerformanceEstimator;