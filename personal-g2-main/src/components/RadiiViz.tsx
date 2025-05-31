"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { pendingTasks } from "./AutomationDashboard/__mocks__/tasks";

// Canvas Zoom Settings
const ZOOM_IN_FACTOR = 1.025;
const ZOOM_OUT_FACTOR = 0.985;
const ZOOM_VELOCITY_SCALE = 0.3;
const ZOOM_DECAY = 0.97;

// Animation Timing
const FRAME_DURATION = 0.016; // 60 FPS equivalent
const LINE_ANIMATION_DURATION = 500; // ms
const POP_IN_DURATION = 500; // ms
const FADE_OUT_DURATION = 300; // ms
const TOTAL_TASK_LIFETIME = 8000; // ms

// UI Settings
const LABEL_FONT = "24px Cash Sans Mono, monospace";
const LABEL_OFFSET = 20; // px above ring
const TASK_DISTANCE_MIN = 20;
const TASK_DISTANCE_MAX = 50;

// Throttling / Spawning
const TASK_SPAWN_INTERVAL_MIN = 50; // ms
const TASK_SPAWN_INTERVAL_MAX = 100; // ms
const MAX_TASKS_PER_AUTOMATION = 25;

// Node Counts
const NUM_USERS = 296;
const NUM_PROJECTS = 53;
const NUM_AUTOMATIONS = 1138;

type NodeType = "user" | "automation" | "project" | "task";

interface Node {
  id: string;
  type: NodeType;
  name: string;
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  speed: number;
  baseSpeed: number;
  angle: number;
  orbit: number;
  opacity: number;
  radius: number;
  parentId?: string | undefined;
  createdAt?: number;
  scale?: number;
  lineProgress?: number;
  showLabel?: boolean;
}

interface WebGLVisualizationProps {
  animate?: boolean;
  width?: number;
  height?: number;
  onNodeCountsChange?: (counts: {
    users: number;
    automations: number;
    projects: number;
    tasks: number;
  }) => void;
}

interface CameraState {
  scale: number;
}

// Add animation states interface
interface AnimationStates {
  rings: number;
  user: number;
  project: number;
  automation: number;
  task: number;
  connections: number;
}

type GroupState = {
  isChangingDirection: boolean;
  transitionProgress: number;
  nextDirectionChange: number;
};

const NODE_COLORS: Record<NodeType, string> = {
  user: "#558def", // Brighter matte blue
  automation: "#3A9B6A", // More matte green
  project: "#ff4f00", // orange
  task: "#9A3D9A", // More matte purple
};

const RING_CONFIG = {
  user: { radius: 200, speed: 0.0015, variance: 0.0008, width: 100 },
  automation: { radius: 800, speed: 0.0024, variance: 0.001, width: 300 },
  project: { radius: 400, speed: 0.0008, variance: 0.0004, width: 100 },
  task: { radius: 1200, speed: 0.0005, variance: 0.0002, width: 200 },
} as const;

const createNode = (
  type: NodeType,
  id: string,
  name: string,
  radius: number,
  color: string,
  parentNode?: Node
): Node => {
  const angle = Math.random() * Math.PI * 2;
  const baseSpeed =
    (Math.random() > 0.5 ? 1 : -1) *
    (RING_CONFIG[type].speed +
      (Math.random() - 0.5) * RING_CONFIG[type].variance);

  // Increase radius variation for better spread while keeping nodes within their ring width
  const radiusVariation = (() => {
    const ringWidth = RING_CONFIG[type].width;
    switch (type) {
      case "user":
        // Keep users within 80% of their ring width
        return (Math.random() - 0.5) * ringWidth * 0.8;
      case "project":
        // Keep projects within 90% of their ring width
        return (Math.random() - 0.5) * ringWidth * 0.9;
      case "automation":
        // Allow automations to spread up to 1.5x their ring width
        return (Math.random() - 0.5) * ringWidth * 1.5;
      case "task":
        // Keep tasks within 75% of their ring width
        return (Math.random() - 0.5) * ringWidth * 0.75;
      default:
        return (Math.random() - 0.5) * ringWidth * 0.5;
    }
  })();

  const actualRadius = radius + radiusVariation;

  // For tasks, position them in the same orbital pattern as their parent
  let x, y, taskAngle, taskSpeed;
  if (type === "task" && parentNode) {
    // Use the parent's angle as base
    taskAngle = parentNode.angle;
    // Add larger random variation to the angle for better spread
    const angleVariation = (Math.random() - 0.5) * 0.3; // Increased from 0.1 to 0.3
    taskAngle += angleVariation;
    // Position task with more variation in distance from parent
    const distanceFromParent = 30 + Math.random() * 40; // Increased from 20-50 to 30-70
    x = parentNode.x + Math.cos(taskAngle) * distanceFromParent;
    y = parentNode.y + Math.sin(taskAngle) * distanceFromParent;

    // Calculate speed based on radius ratio to maintain constant distance
    const parentRadius = Math.sqrt(
      parentNode.x * parentNode.x + parentNode.y * parentNode.y
    );
    const taskRadius = Math.sqrt(x * x + y * y);
    const radiusRatio = taskRadius / parentRadius;
    taskSpeed = parentNode.speed * radiusRatio * 1.5;
  } else {
    x = Math.cos(angle) * actualRadius;
    y = Math.sin(angle) * actualRadius;
    taskAngle = angle;
    taskSpeed = baseSpeed;
  }

  // For tasks, randomly select a task from the mock data
  let taskTitle = name;
  if (type === "task") {
    const randomTask =
      pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
    taskTitle = randomTask.title;
  }

  return {
    id,
    type,
    name: taskTitle,
    x,
    y,
    z: 0,
    size: 2.5,
    color,
    speed: taskSpeed,
    baseSpeed: taskSpeed,
    angle: taskAngle,
    orbit: 0,
    opacity: type === "task" ? 0 : 0.8,
    radius: actualRadius,
    parentId: undefined,
    createdAt: type === "task" ? Date.now() : undefined,
    scale: type === "task" ? 0 : 1,
    lineProgress: type === "task" ? 0 : 1,
    showLabel: type === "task" ? Math.random() < 0.05 : undefined,
  };
};

const generateMockNodes = (): Node[] => {
  const nodes: Node[] = [];
  const now = Date.now();

  // Create users first
  const users: Node[] = [];
  for (let i = 0; i < NUM_USERS; i++) {
    users.push(
      createNode(
        "user",
        `user-${i}`,
        `User ${i}`,
        RING_CONFIG.user.radius,
        NODE_COLORS.user
      )
    );
  }

  // Create projects
  const projects: Node[] = [];
  for (let i = 0; i < NUM_PROJECTS; i++) {
    projects.push(
      createNode(
        "project",
        `project-${i}`,
        `Project ${i}`,
        RING_CONFIG.project.radius,
        NODE_COLORS.project
      )
    );
  }

  // Assign users to projects (0-10 projects per user)
  users.forEach((user) => {
    const numProjects = Math.floor(Math.random() * 20); // 0-10 projects
    const userProjects = projects
      .sort(() => Math.random() - 0.5)
      .slice(0, numProjects);
    userProjects.forEach((project) => {
      project.parentId = user.id;
    });
  });

  // Create automations and assign them to users and projects
  const automations: Node[] = [];
  for (let i = 0; i < NUM_AUTOMATIONS; i++) {
    const automation = createNode(
      "automation",
      `automation-${i}`,
      `Automation ${i}`,
      RING_CONFIG.automation.radius,
      NODE_COLORS.automation
    );

    // Assign to a random user
    const randomUser = users[Math.floor(Math.random() * users.length)];
    automation.parentId = randomUser.id;

    // Assign to a random project (if any)
    const userProjects = projects.filter((p) => p.parentId === randomUser.id);
    if (userProjects.length > 0) {
      const randomProject =
        userProjects[Math.floor(Math.random() * userProjects.length)];
      automation.parentId = randomProject.id;
    }

    automations.push(automation);
  }

  // Add all nodes to the main array (no tasks initially)
  nodes.push(...users, ...projects, ...automations);

  return nodes;
};

export function RadiiViz({
  animate = true,
  width,
  height,
  onNodeCountsChange,
}: WebGLVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const velocityRef = useRef<number>(0);
  const scaleRef = useRef<number>(1);
  const { theme } = useTheme();
  const [camera, setCamera] = useState<CameraState>({
    scale: 1,
  });

  // Add animation states
  const [animationStates, setAnimationStates] = useState<AnimationStates>({
    rings: 0,
    user: 0,
    project: 0,
    automation: 0,
    task: 0,
    connections: 0,
  });

  // Add animation timing constants
  const ANIMATION_DURATION = 1000; // ms
  const ANIMATION_DELAY = 500; // ms between each stage

  const [nodes, setNodes] = useState<Node[]>(() => generateMockNodes());

  const nodeMap = useMemo(() => {
    const map = new Map<string, Node>();
    nodes.forEach((node) => {
      map.set(node.id, node);
    });
    return map;
  }, [nodes]);

  // Add function to check if an automation has tasks
  const hasTasks = (automationId: string): boolean => {
    return nodes.some(
      (node) => node.type === "task" && node.parentId === automationId
    );
  };

  const automations = useMemo(
    () => nodes.filter((node) => node.type === "automation"),
    [nodes]
  );

  const groupStates = useRef<Record<NodeType, GroupState>>({
    user: {
      isChangingDirection: false,
      transitionProgress: 0,
      nextDirectionChange: Date.now() + Math.random() * 5000,
    },
    automation: {
      isChangingDirection: false,
      transitionProgress: 0,
      nextDirectionChange: Date.now() + Math.random() * 5000,
    },
    project: {
      isChangingDirection: false,
      transitionProgress: 0,
      nextDirectionChange: Date.now() + Math.random() * 5000,
    },
    task: {
      isChangingDirection: false,
      transitionProgress: 0,
      nextDirectionChange: Date.now() + Math.random() * 5000,
    },
  });

  // Task management
  useEffect(() => {
    const currentTasks = nodes.filter((node) => node.type === "task");
    const maxTasks = automations.length * MAX_TASKS_PER_AUTOMATION;

    let spawnTimeout: NodeJS.Timeout | null = null;

    const generateNewTasks = () => {
      const availableSlots = maxTasks - currentTasks.length;

      if (availableSlots <= 0) {
        // Too many tasks, wait and check again later
        scheduleNextSpawn();
        return;
      }

      const numTasksToGenerate = Math.min(
        Math.floor(Math.random() * 10) + 5, // 5-15 tasks at a time
        availableSlots
      );

      const newTasks: Node[] = [];

      for (let i = 0; i < numTasksToGenerate; i++) {
        const randomAutomation =
          automations[Math.floor(Math.random() * automations.length)];
        const newTask = createNode(
          "task",
          `task-${randomAutomation.id}-${Date.now()}-${i}`,
          `Task ${Date.now()}-${i}`,
          RING_CONFIG.task.radius,
          NODE_COLORS.task,
          randomAutomation
        );
        newTask.parentId = randomAutomation.id;
        newTasks.push(newTask);
      }

      setNodes((prevNodes) => [...prevNodes, ...newTasks]);

      scheduleNextSpawn();
    };

    const scheduleNextSpawn = () => {
      const nextDelay =
        TASK_SPAWN_INTERVAL_MIN +
        Math.random() * (TASK_SPAWN_INTERVAL_MAX - TASK_SPAWN_INTERVAL_MIN);
      spawnTimeout = setTimeout(generateNewTasks, nextDelay);
    };

    scheduleNextSpawn(); // Start the first spawn

    return () => {
      if (spawnTimeout) clearTimeout(spawnTimeout);
    };
  }, [nodes, automations]);

  // Add animation effect
  useEffect(() => {
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      // Animate rings
      if (elapsed < ANIMATION_DURATION) {
        setAnimationStates((prev) => ({
          ...prev,
          rings: elapsed / ANIMATION_DURATION,
        }));
      }
      // Animate users
      else if (elapsed < ANIMATION_DURATION + ANIMATION_DELAY) {
        setAnimationStates((prev) => ({
          ...prev,
          user: (elapsed - ANIMATION_DELAY) / ANIMATION_DURATION,
        }));
      }
      // Animate projects
      else if (elapsed < ANIMATION_DURATION + ANIMATION_DELAY * 2) {
        setAnimationStates((prev) => ({
          ...prev,
          project: (elapsed - ANIMATION_DELAY * 2) / ANIMATION_DURATION,
        }));
      }
      // Animate automations
      else if (elapsed < ANIMATION_DURATION + ANIMATION_DELAY * 3) {
        setAnimationStates((prev) => ({
          ...prev,
          automation: (elapsed - ANIMATION_DELAY * 3) / ANIMATION_DURATION,
        }));
      }
      // Animate tasks
      else if (elapsed < ANIMATION_DURATION + ANIMATION_DELAY * 4) {
        setAnimationStates((prev) => ({
          ...prev,
          task: (elapsed - ANIMATION_DELAY * 4) / ANIMATION_DURATION,
        }));
      }
      // Animate connections and labels
      else if (elapsed < ANIMATION_DURATION + ANIMATION_DELAY * 5) {
        const progress = (elapsed - ANIMATION_DELAY * 5) / ANIMATION_DURATION;
        setAnimationStates((prev) => ({
          ...prev,
          connections: progress,
        }));
      }
    };

    const interval = setInterval(animate, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = theme === "dark" ? "#888" : "#999"; // Gray rings
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  };

  const drawLabel = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    label: string,
    color: string
  ) => {
    ctx.save();
    ctx.font = LABEL_FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = theme === "dark" ? "#fff" : "#000";
    ctx.globalAlpha = 1;
    ctx.fillText(
      `${label.toUpperCase()}S`,
      centerX,
      centerY - radius - LABEL_OFFSET
    );
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? ZOOM_OUT_FACTOR : ZOOM_IN_FACTOR;
      velocityRef.current = (zoomFactor - 1) * ZOOM_VELOCITY_SCALE;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        canvas.dataset.initialDistance = initialDistance.toString();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const initialDistance = parseFloat(
          canvas.dataset.initialDistance || "0"
        );
        const zoomFactor =
          1 + ((currentDistance - initialDistance) / initialDistance) * 0.08;

        velocityRef.current = (zoomFactor - 1) * 0.3;
      }
    };

    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = width || window.innerWidth;
      const h = height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    let startTime = Date.now();
    let lastFrameTime = startTime;

    const render = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const deltaTime = (now - lastFrameTime) / 1000;
      lastFrameTime = now;

      if (Math.abs(velocityRef.current) > 0.0001) {
        scaleRef.current = Math.max(
          0.4,
          Math.min(2, scaleRef.current * (1 + velocityRef.current))
        );
        velocityRef.current *= ZOOM_DECAY;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const breathing = 1 + Math.sin(elapsed * 0.5) * 0.02;

      // Draw center circle with ring animation
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        10 * scaleRef.current * animationStates.rings,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = theme === "dark" ? "#fff" : "#000";
      ctx.fillStyle = theme === "dark" ? "#000" : "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fill();
      ctx.globalAlpha = 1.0;

      const rings: Array<{
        config: (typeof RING_CONFIG)[keyof typeof RING_CONFIG];
        type: NodeType;
      }> = [
        { config: RING_CONFIG.user, type: "user" },
        { config: RING_CONFIG.automation, type: "automation" },
        { config: RING_CONFIG.project, type: "project" },
        { config: RING_CONFIG.task, type: "task" },
      ];

      rings.forEach(
        ({
          config,
          type,
        }: {
          config: (typeof RING_CONFIG)[keyof typeof RING_CONFIG];
          type: NodeType;
        }) => {
          const parallaxFactor = 1 - config.radius / RING_CONFIG.task.radius;
          const scaledRadius =
            config.radius *
            scaleRef.current *
            (1 + parallaxFactor * (scaleRef.current - 1));

          // Apply staggered ring animation based on ring type
          let ringScale = 0;
          let ringOpacity = 0;

          // Calculate delay based on ring type with more overlap
          const delays: Record<NodeType, number> = {
            user: 0.3,
            project: 0.2,
            automation: 0.1,
            task: 0,
          };
          const delay = delays[type];

          // Apply staggered animation with longer duration for smoother overlap
          if (animationStates.rings > delay) {
            const rawProgress = (animationStates.rings - delay) / 0.6; // Increased duration for smoother overlap
            const progress = Math.min(1, rawProgress);
            // Apply ease-in effect
            const easeInProgress = progress * progress;
            ringScale = easeInProgress;
            ringOpacity = easeInProgress;
          }

          ctx.globalAlpha = ringOpacity;
          drawCircle(
            ctx,
            centerX,
            centerY,
            scaledRadius * ringScale +
              config.width * breathing * scaleRef.current
          );

          // Apply label animation based on the group type
          const labelOpacity =
            animationStates[type as keyof AnimationStates] || 0;
          ctx.globalAlpha = labelOpacity;
          drawLabel(
            ctx,
            centerX,
            centerY,
            scaledRadius * ringScale +
              config.width * breathing * scaleRef.current,
            type.charAt(0).toUpperCase() + type.slice(1),
            NODE_COLORS[type as NodeType]
          );
        }
      );

      // Draw connections between nodes
      nodes.forEach((node) => {
        if (node.parentId) {
          const parentNode = nodeMap.get(node.parentId ?? "");
          if (parentNode) {
            ctx.beginPath();
            ctx.moveTo(centerX + parentNode.x, centerY + parentNode.y);

            // Calculate line progress based on animation state
            const connectionProgress = animationStates.connections;
            const easeInProgress = connectionProgress * connectionProgress;

            // For tasks, animate the line based on lineProgress
            if (node.type === "task" && node.lineProgress !== undefined) {
              const dx = node.x - parentNode.x;
              const dy = node.y - parentNode.y;
              const endX = parentNode.x + dx * node.lineProgress;
              const endY = parentNode.y + dy * node.lineProgress;
              ctx.lineTo(centerX + endX, centerY + endY);

              // Set line opacity based on animation progress
              if (node.lineProgress < 1) {
                ctx.globalAlpha = 0.6 * animationStates.connections; // Full opacity during line animation
              } else {
                ctx.globalAlpha = 0.2 * animationStates.connections; // Fade to 0.2 after animation
              }
            } else {
              // Animate all other connections from origin to destination
              const dx = node.x - parentNode.x;
              const dy = node.y - parentNode.y;
              const endX = parentNode.x + dx * easeInProgress;
              const endY = parentNode.y + dy * easeInProgress;
              ctx.lineTo(centerX + endX, centerY + endY);
              ctx.globalAlpha = 0.15 * easeInProgress; // Fade in with ease-in effect
            }

            ctx.strokeStyle = node.color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      nodes.forEach((node) => {
        if (node.type === "task") {
          if (!node.createdAt) {
            node.createdAt = now;
          } else {
            const age = now - node.createdAt;
            const lineDuration = LINE_ANIMATION_DURATION;
            const popInDuration = POP_IN_DURATION;
            const fadeOutDuration = FADE_OUT_DURATION;
            const totalLifetime = TOTAL_TASK_LIFETIME;

            if (age < lineDuration) {
              node.lineProgress = age / lineDuration;
              node.opacity = 0;
              node.scale = 0;
            } else if (age < lineDuration + popInDuration) {
              node.lineProgress = 1;
              const progress = (age - lineDuration) / popInDuration;
              node.opacity = progress * 0.8;
              const springProgress = Math.sin(progress * Math.PI * 2) * 0.1;
              node.scale = 1 + springProgress;
            } else if (age > totalLifetime - fadeOutDuration) {
              node.lineProgress = 1;
              node.opacity = ((totalLifetime - age) / fadeOutDuration) * 0.8;
              node.scale = 1;
            } else {
              node.lineProgress = 1;
              node.scale = 1;
            }

            // Update task position to follow parent's orbit and speed
            const parentNode = nodeMap.get(node.parentId ?? "");
            if (parentNode) {
              // Calculate speed based on radius ratio to maintain constant distance
              const parentRadius = Math.sqrt(
                parentNode.x * parentNode.x + parentNode.y * parentNode.y
              );
              const taskRadius = Math.sqrt(node.x * node.x + node.y * node.y);
              const radiusRatio = taskRadius / parentRadius;
              // Increase speed multiplier to make tasks move faster
              node.speed = parentNode.speed * radiusRatio * 1.5;
              node.baseSpeed = parentNode.speed * radiusRatio * 1.5;

              // Calculate angle from parent to center
              const parentAngle = Math.atan2(parentNode.y, parentNode.x);
              // Add small offset to maintain relative position
              const angleOffset = node.angle - parentNode.angle;
              node.angle = parentAngle + angleOffset;

              // Position task relative to parent
              const distanceFromParent =
                TASK_DISTANCE_MIN +
                Math.random() * (TASK_DISTANCE_MAX - TASK_DISTANCE_MIN);
              node.x = parentNode.x + Math.cos(node.angle) * distanceFromParent;
              node.y = parentNode.y + Math.sin(node.angle) * distanceFromParent;
            }

            if (age > totalLifetime) {
              const index = nodes.indexOf(node);
              if (index > -1) {
                // Get the parent automation before removing the task
                const parentAutomation = nodeMap.get(node.parentId ?? "");
                nodes.splice(index, 1);

                // If this was the last task for the automation, restore its movement
                if (parentAutomation && !hasTasks(parentAutomation.id)) {
                  parentAutomation.speed = parentAutomation.baseSpeed;
                }
              }
              return;
            }
          }
        }

        const groupState = groupStates.current[node.type];

        if (
          now > groupState.nextDirectionChange &&
          !groupState.isChangingDirection
        ) {
          groupState.isChangingDirection = true;
          groupState.transitionProgress = 0;
        }

        if (groupState.isChangingDirection) {
          groupState.transitionProgress += FRAME_DURATION;
          if (groupState.transitionProgress < 0.5) {
            const slowdown = 1 - groupState.transitionProgress * 2;
            node.speed = node.baseSpeed * slowdown;
          } else if (groupState.transitionProgress < 1.0) {
            const speedup = (groupState.transitionProgress - 0.5) * 2;
            node.speed = -node.baseSpeed * speedup;
          } else {
            groupState.isChangingDirection = false;
            node.baseSpeed = -node.baseSpeed;
            node.speed = node.baseSpeed;
            groupState.nextDirectionChange =
              now + 10000 + Math.random() * 10000;
          }
        }

        // Handle automation movement based on tasks
        if (node.type === "automation") {
          if (hasTasks(node.id)) {
            // Gradually slow down when tasks are present
            node.speed = node.speed * 0.95;
          } else {
            // Gradually resume normal speed when no tasks
            node.speed = node.speed + (node.baseSpeed - node.speed) * 0.05;
          }

          const parallaxFactor =
            1 - node.radius / (RING_CONFIG.task.radius * 1.2);
          node.angle += node.speed * parallaxFactor;

          if (node.angle > Math.PI * 2) node.angle -= Math.PI * 2;
          if (node.angle < 0) node.angle += Math.PI * 2;
        } else {
          const parallaxFactor =
            1 - node.radius / (RING_CONFIG.task.radius * 1.2);
          node.angle += node.speed * parallaxFactor;

          if (node.angle > Math.PI * 2) node.angle -= Math.PI * 2;
          if (node.angle < 0) node.angle += Math.PI * 2;
        }

        // Apply parallax scaling to all nodes, including stationary ones
        const parallaxFactor =
          1 - node.radius / (RING_CONFIG.task.radius * 1.2);
        const scaledRadius =
          node.radius *
          scaleRef.current *
          (1 + parallaxFactor * (scaleRef.current - 1));
        node.x = Math.cos(node.angle) * scaledRadius * breathing;
        node.y = Math.sin(node.angle) * scaledRadius * breathing;

        // Apply node type specific animation
        const nodeAnimation = animationStates[node.type];
        if (nodeAnimation === undefined) return;

        // Apply scale and opacity based on animation state
        const nodeScale = (node.scale || 1) * nodeAnimation;
        const nodeOpacity = node.opacity * nodeAnimation;

        ctx.beginPath();
        ctx.arc(
          centerX + node.x,
          centerY + node.y,
          5 * scaleRef.current * nodeScale,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = node.color;
        ctx.globalAlpha = nodeOpacity;
        ctx.fill();

        // Draw task label if it's a task and showLabel is true
        if (node.type === "task" && node.showLabel) {
          ctx.save();
          ctx.font = "14px Cash Sans Mono, monospace";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillStyle = theme === "dark" ? "#fff" : "#000";
          ctx.globalAlpha = nodeOpacity;

          // Calculate angle from center to node
          const angleToCenter = Math.atan2(node.y, node.x);

          // Draw background rectangle
          const textWidth = ctx.measureText(node.name).width;
          const padding = 4;
          const rectWidth = textWidth + padding * 2;
          const rectHeight = 20;

          // Position label at an angle from the node
          const labelDistance = 15; // Distance from node to label
          const isLeftSide = node.x < 0;

          // Adjust label position based on side
          const labelX =
            centerX +
            node.x +
            Math.cos(angleToCenter) *
              (isLeftSide ? -labelDistance : labelDistance);
          const labelY =
            centerY +
            node.y +
            Math.sin(angleToCenter) *
              (isLeftSide ? -labelDistance : labelDistance);

          // Rotate context to align text with the angle
          ctx.translate(labelX, labelY);

          // If the label is on the left side of the screen, rotate it 180 degrees
          if (isLeftSide) {
            ctx.rotate(angleToCenter + Math.PI);
            // Move the label to account for the rotation
            ctx.translate(-rectWidth, 0);
          } else {
            ctx.rotate(angleToCenter);
          }

          // Draw background rectangle
          ctx.fillStyle =
            theme === "dark"
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(0, -rectHeight / 2, rectWidth, rectHeight);

          // Draw text
          ctx.fillStyle = theme === "dark" ? "#fff" : "#000";
          ctx.fillText(node.name, padding, 0);
          ctx.restore();
        }
      });

      ctx.globalAlpha = 1.0;
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, nodes, theme, width, height, animationStates]);

  // Add effect to update node counts
  useEffect(() => {
    if (onNodeCountsChange) {
      const counts = {
        users: nodes.filter((node) => node.type === "user").length,
        automations: nodes.filter((node) => node.type === "automation").length,
        projects: nodes.filter((node) => node.type === "project").length,
        tasks: nodes.filter((node) => node.type === "task").length,
      };
      onNodeCountsChange(counts);
    }
  }, [nodes, onNodeCountsChange]);

  return <canvas ref={canvasRef} className=" inset-0 origin-center" />;
}
