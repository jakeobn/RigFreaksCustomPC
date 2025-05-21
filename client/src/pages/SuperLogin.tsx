import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export default function SuperLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try the traditional login endpoint first
      const response = await axios.post('/api/login', { email, password });
      
      if (response.data) {
        toast({
          title: 'Login successful',
          description: `Welcome back, ${response.data.username || email}!`,
        });
        navigate('/admin');
      }
    } catch (err) {
      // If traditional login fails, try the debug endpoint
      try {
        const debugResponse = await axios.get('/api/debug/connection');
        if (debugResponse.status === 200) {
          toast({
            title: 'Connection successful',
            description: 'Your connection to the server is working correctly.',
          });
          
          // Try to check database connection
          try {
            const dbResponse = await axios.get('/api/debug/database');
            toast({
              title: 'Database connection',
              description: dbResponse.data.success ? 'Database connection is working.' : 'Database connection failed.',
            });
          } catch (dbErr) {
            toast({
              title: 'Database connection failed',
              description: 'Could not connect to the database.',
              variant: 'destructive'
            });
          }
        }
      } catch (debugErr) {
        setError('Could not connect to server. Please try again later.');
      }
      
      // Handle original login error
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Enhanced Login</CardTitle>
          <CardDescription>
            This login page includes extra network diagnostics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-gray-500">
            Try admin@rigfreaks.com / admin123
          </div>
          <Button
            variant="link"
            className="p-0 h-auto text-xs"
            onClick={() => navigate('/auth')}
          >
            Use Standard Login
          </Button>
        </CardFooter>
        
        <div className="p-4 bg-gray-50 rounded-b-lg border-t">
          <h3 className="font-medium text-sm">Connection Troubleshooting</h3>
          <div className="mt-2 space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={async () => {
                try {
                  const response = await axios.get('/api/health');
                  toast({
                    title: 'Health Check',
                    description: `Status: ${response.data.status}, Time: ${new Date(response.data.timestamp).toLocaleTimeString()}`,
                  });
                } catch (err) {
                  toast({
                    title: 'Health Check Failed',
                    description: 'Could not connect to server.',
                    variant: 'destructive'
                  });
                }
              }}
            >
              Check Server Health
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={async () => {
                try {
                  const response = await axios.get('/api/debug/connection');
                  toast({
                    title: 'Connection Check',
                    description: 'Server connection successful!',
                  });
                } catch (err) {
                  toast({
                    title: 'Connection Check Failed',
                    description: 'Could not connect to server.',
                    variant: 'destructive'
                  });
                }
              }}
            >
              Test Connection
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={async () => {
                try {
                  const response = await axios.get('/api/debug/database');
                  toast({
                    title: 'Database Check',
                    description: response.data.success 
                      ? `Database connected at ${new Date(response.data.timestamp).toLocaleTimeString()}`
                      : 'Database connection failed',
                    variant: response.data.success ? 'default' : 'destructive'
                  });
                } catch (err) {
                  toast({
                    title: 'Database Check Failed',
                    description: 'Could not connect to database.',
                    variant: 'destructive'
                  });
                }
              }}
            >
              Test Database
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={async () => {
                try {
                  const response = await axios.get('/api/debug/network');
                  const checks = response.data.networkChecks;
                  const results = Object.keys(checks)
                    .map(url => `${url.split('//')[1].split('/')[0]}: ${checks[url].ok ? '✓' : '✗'}`)
                    .join(', ');
                  
                  toast({
                    title: 'Network Check',
                    description: `Results: ${results}`,
                  });
                } catch (err) {
                  toast({
                    title: 'Network Check Failed',
                    description: 'Could not run network diagnostics.',
                    variant: 'destructive'
                  });
                }
              }}
            >
              Test Network
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}