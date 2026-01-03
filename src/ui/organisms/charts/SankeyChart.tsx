'use client';

import { useMemo } from 'react';
import type { SankeyData } from './chart.types';

interface SankeyChartProps {
  data: SankeyData;
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
}

export function SankeyChartComponent({
  data,
  width = 800,
  height = 400,
  nodeWidth = 15,
  nodePadding = 10,
}: SankeyChartProps) {
  const layout = useMemo(() => {
    if (data.nodes.length === 0 || data.links.length === 0) {
      return null;
    }

    const nodeMap = new Map(data.nodes.map((node) => [node.id, node]));
    const sourceNodes = new Set(data.links.map((link) => link.source));
    const targetNodes = new Set(data.links.map((link) => link.target));

    const leftNodes = data.nodes.filter((node) => sourceNodes.has(node.id));
    const rightNodes = data.nodes.filter(
      (node) => targetNodes.has(node.id) && !sourceNodes.has(node.id)
    );

    const leftPositions = leftNodes.map((node, index) => ({
      ...node,
      x: 0,
      y: index * (nodePadding + nodeWidth),
      width: nodeWidth,
      height: nodeWidth,
    }));

    const rightPositions = rightNodes.map((node, index) => ({
      ...node,
      x: width - nodeWidth,
      y: index * (nodePadding + nodeWidth),
      width: nodeWidth,
      height: nodeWidth,
    }));

    const allPositions = [...leftPositions, ...rightPositions];
    const positionMap = new Map(
      allPositions.map((pos) => [pos.id, pos])
    );

    const links = data.links.map((link) => {
      const source = positionMap.get(link.source);
      const target = positionMap.get(link.target);
      if (!source || !target) return null;

      return {
        ...link,
        sourceX: source.x + source.width,
        sourceY: source.y + source.height / 2,
        targetX: target.x,
        targetY: target.y + target.height / 2,
        value: link.value,
      };
    }).filter(Boolean) as Array<{
      source: string;
      target: string;
      value: number;
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
    }>;

    return { nodes: allPositions, links };
  }, [data, width, nodeWidth, nodePadding]);

  if (!layout || layout.nodes.length === 0 || layout.links.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="overflow-visible">
        {layout.links.map((link, index) => {
          const dx = link.targetX - link.sourceX;
          const dy = link.targetY - link.sourceY;
          const dr = Math.sqrt(dx * dx + dy * dy);

          return (
            <path
              key={index}
              d={`M${link.sourceX},${link.sourceY}A${dr},${dr} 0 0,1 ${link.targetX},${link.targetY}`}
              fill="none"
              stroke="hsl(var(--color-primary))"
              strokeWidth={Math.max(2, Math.min(link.value / 10, 20))}
              strokeOpacity={0.6}
            />
          );
        })}
        {layout.nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              fill="hsl(var(--color-secondary))"
              fillOpacity={0.8}
              rx={2}
            />
            <text
              x={node.x < width / 2 ? node.x + node.width + 5 : node.x - 5}
              y={node.y + node.height / 2}
              textAnchor={node.x < width / 2 ? 'start' : 'end'}
              dominantBaseline="middle"
              className="fill-foreground text-xs"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

