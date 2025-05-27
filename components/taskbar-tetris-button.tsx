"use client"

import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useResponsiveLayout } from "./responsive-helpers"

interface TaskbarTetrisButtonProps {
  onClick: () => void
  isActive: boolean
}

export default function TaskbarTetrisButton({ onClick, isActive }: TaskbarTetrisButtonProps) {
  const { deviceType } = useResponsiveLayout()

  return (
    <Button
      variant="outline"
      className={`rounded-none text-black flex items-center gap-1 ${isActive ? "bg-gray-400" : "bg-gray-300"} ${
        deviceType === "mobile" ? "h-7 text-[10px] px-1" : "h-8 text-xs px-2"
      }`}
      style={{
        boxShadow: isActive
          ? "inset -1px -1px #dfdfdf, inset 1px 1px #0a0a0a, inset -2px -2px white, inset 2px 2px grey"
          : "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
      }}
      onClick={onClick}
    >
      <Gamepad2 size={16} />
      <span className="truncate">Tetris</span>
    </Button>
  )
}

