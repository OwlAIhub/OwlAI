"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Database, Wifi, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface PerformanceMetrics {
  avgResponseTime: number;
  totalRequests: number;
  cacheHits: number;
  streamingEnabled: boolean;
  lastResponseTime: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    avgResponseTime: 0,
    totalRequests: 0,
    cacheHits: 0,
    streamingEnabled: true,
    lastResponseTime: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for performance events
    const handlePerformanceEvent = (event: CustomEvent) => {
      const { type, data } = event.detail;

      setMetrics((prev) => {
        switch (type) {
          case "response_time":
            const newAvg =
              prev.totalRequests === 0
                ? data.responseTime
                : (prev.avgResponseTime * prev.totalRequests +
                    data.responseTime) /
                  (prev.totalRequests + 1);

            return {
              ...prev,
              avgResponseTime: Math.round(newAvg),
              totalRequests: prev.totalRequests + 1,
              lastResponseTime: data.responseTime,
            };

          case "cache_hit":
            return {
              ...prev,
              cacheHits: prev.cacheHits + 1,
            };

          case "streaming_toggle":
            return {
              ...prev,
              streamingEnabled: data.enabled,
            };

          default:
            return prev;
        }
      });
    };

    window.addEventListener(
      "flowise-performance",
      handlePerformanceEvent as EventListener,
    );

    return () => {
      window.removeEventListener(
        "flowise-performance",
        handlePerformanceEvent as EventListener,
      );
    };
  }, []);

  // Toggle visibility with Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "P") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isVisible) return null;

  const getResponseTimeColor = (time: number) => {
    if (time < 2000) return "bg-green-500";
    if (time < 5000) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getResponseTimeLabel = (time: number) => {
    if (time < 2000) return "Fast";
    if (time < 5000) return "Medium";
    return "Slow";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance Monitor
            <Badge variant="outline" className="ml-auto text-xs">
              Ctrl+Shift+P
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-500" />
              <div>
                <div className="text-gray-500">Avg Response</div>
                <div className="font-medium">{metrics.avgResponseTime}ms</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-500" />
              <div>
                <div className="text-gray-500">Last Response</div>
                <div className="font-medium flex items-center gap-1">
                  {metrics.lastResponseTime}ms
                  <div
                    className={`w-2 h-2 rounded-full ${getResponseTimeColor(metrics.lastResponseTime)}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-gray-500" />
              <div>
                <div className="text-gray-500">Cache Hits</div>
                <div className="font-medium">
                  {metrics.cacheHits}/{metrics.totalRequests}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-gray-500" />
              <div>
                <div className="text-gray-500">Streaming</div>
                <div className="font-medium">
                  <Badge
                    variant={metrics.streamingEnabled ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {metrics.streamingEnabled ? "ON" : "OFF"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="text-xs text-gray-500">
              Status:{" "}
              <span
                className={`${getResponseTimeColor(metrics.avgResponseTime)} text-white px-1 rounded text-xs`}
              >
                {getResponseTimeLabel(metrics.avgResponseTime)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
