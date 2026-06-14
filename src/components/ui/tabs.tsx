import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

/**
 * Neumorphic Tabs — Phase 2
 *
 * Design Rules:
 *  - TabsList: deep inset track (neo-inset-deep) — acts as a carved rail
 *  - TabsTrigger: resting = flat/transparent inside the track
 *               active = extruded (neo-surface-sm) — pops out of the track
 *  - No borders. No ring-offset. Accent ring via box-shadow on focus.
 */
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Inset track — carved into the page
      "inline-flex items-center justify-center gap-1",
      "bg-neo-base shadow-neo-inset-deep",
      "rounded-neo-btn p-1.5",
      "text-neo-muted",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base
      "inline-flex items-center justify-center whitespace-nowrap",
      "px-4 py-2 text-sm font-medium",
      "rounded-xl",
      "transition-all duration-300 ease-out",
      "disabled:pointer-events-none disabled:opacity-50",
      // Resting: transparent, recessed in track
      "text-neo-muted",
      // Active: pops out as extruded surface
      "data-[state=active]:bg-neo-base",
      "data-[state=active]:shadow-neo-flat-sm",
      "data-[state=active]:text-neo-fg",
      "data-[state=active]:font-semibold",
      // Focus
      "focus-visible:outline-none",
      "focus-visible:shadow-neo-focus",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4",
      "focus-visible:outline-none focus-visible:shadow-neo-focus rounded-neo-btn",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
