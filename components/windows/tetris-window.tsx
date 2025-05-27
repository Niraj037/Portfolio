"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCw, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import { useResponsiveLayout } from "../responsive-helpers"
import { useSettings } from "@/hooks/use-settings"

// Tetris piece shapes
const SHAPES = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // J
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  // L
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  // O
  [
    [4, 4],
    [4, 4],
  ],
  // S
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  // T
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  // Z
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
]

// Colors for each piece - using bright, visible colors
const COLORS = [
  "transparent",
  "#00FFFF", // I - Cyan
  "#0000FF", // J - Blue
  "#FF7F00", // L - Orange
  "#FFFF00", // O - Yellow
  "#00FF00", // S - Green
  "#800080", // T - Purple
  "#FF0000", // Z - Red
]

export default function TetrisWindow() {
  const { deviceType } = useResponsiveLayout()
  const { settings } = useSettings()

  // Responsive configuration based on device type
  const getConfig = () => {
    switch (deviceType) {
      case "mobile":
        return {
          rows: 15,
          cols: 10,
          blockSize: 15,
        }
      case "tablet":
        return {
          rows: 18,
          cols: 10,
          blockSize: 20,
        }
      default:
        return {
          rows: 20,
          cols: 10,
          blockSize: 25,
        }
    }
  }

  const { rows: ROWS, cols: COLS, blockSize: BLOCK_SIZE } = getConfig()

  const [grid, setGrid] = useState<number[][]>(
    Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(0)),
  )
  const [piece, setPiece] = useState<number[][]>([])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [nextPiece, setNextPiece] = useState<number[][]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nextPieceCanvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const dropTimeRef = useRef<number>(1000)
  const dropCounterRef = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lineClearAudioRef = useRef<HTMLAudioElement | null>(null)
  const gameOverAudioRef = useRef<HTMLAudioElement | null>(null)

  // Load high score from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighScore = localStorage.getItem("tetris-high-score")
      if (savedHighScore) {
        setHighScore(Number.parseInt(savedHighScore))
      }
    }

    // Initialize audio
    audioRef.current = new Audio("/tetris-move.mp3")
    lineClearAudioRef.current = new Audio("/tetris-line.mp3")
    gameOverAudioRef.current = new Audio("/tetris-gameover.mp3")

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Save high score to localStorage when it changes
  useEffect(() => {
    if (highScore > 0 && typeof window !== "undefined") {
      localStorage.setItem("tetris-high-score", highScore.toString())
    }
  }, [highScore])

  // Initialize game
  const initGame = useCallback(() => {
    setGrid(
      Array(ROWS)
        .fill(0)
        .map(() => Array(COLS).fill(0)),
    )
    const randomPiece = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    setPiece(randomPiece)
    setNextPiece(SHAPES[Math.floor(Math.random() * SHAPES.length)])
    setPosition({ x: Math.floor(COLS / 2) - Math.floor(randomPiece[0].length / 2), y: 0 })
    setGameOver(false)
    setPaused(false)
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameStarted(true)
    dropTimeRef.current = 1000
  }, [ROWS, COLS])

  // Check collision
  const checkCollision = useCallback(
    (p: number[][], pos: { x: number; y: number }) => {
      for (let y = 0; y < p.length; y++) {
        for (let x = 0; x < p[y].length; x++) {
          // Skip empty cells
          if (!p[y][x]) continue

          // Check boundaries
          if (pos.x + x < 0 || pos.x + x >= COLS || pos.y + y >= ROWS) {
            return true
          }

          // Check if cell is already occupied
          if (pos.y + y >= 0 && grid[pos.y + y][pos.x + x] !== 0) {
            return true
          }
        }
      }
      return false
    },
    [grid, ROWS, COLS],
  )

  // Rotate piece
  const rotatePiece = useCallback(() => {
    if (paused || gameOver || !gameStarted) return

    const rotated = piece.map((_, i) => piece.map((col) => col[i])).reverse()
    if (!checkCollision(rotated, position)) {
      setPiece(rotated)

      // Play sound effect
      if (settings.enableMusic) {
        audioRef.current?.play().catch((e) => console.log("Audio playback prevented:", e))
      }
    }
  }, [piece, position, checkCollision, paused, gameOver, gameStarted, settings.enableMusic])

  // Move piece
  const movePiece = useCallback(
    (dir: number) => {
      if (paused || gameOver || !gameStarted) return

      const newPos = { ...position, x: position.x + dir }
      if (!checkCollision(piece, newPos)) {
        setPosition(newPos)

        // Play sound effect
        if (settings.enableMusic) {
          audioRef.current?.play().catch((e) => console.log("Audio playback prevented:", e))
        }
      }
    },
    [piece, position, checkCollision, paused, gameOver, gameStarted, settings.enableMusic],
  )

  // Drop piece
  const dropPiece = useCallback(() => {
    if (paused || gameOver || !gameStarted) return

    const newPos = { ...position, y: position.y + 1 }
    if (!checkCollision(piece, newPos)) {
      setPosition(newPos)
    } else {
      // Piece has landed
      // Merge piece with grid
      const newGrid = [...grid]
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] !== 0) {
            if (position.y + y < 0) {
              // Game over
              setGameOver(true)

              // Play game over sound
              if (settings.enableMusic) {
                gameOverAudioRef.current?.play().catch((e) => console.log("Audio playback prevented:", e))
              }

              // Update high score if needed
              if (score > highScore) {
                setHighScore(score)
              }

              return
            }
            newGrid[position.y + y][position.x + x] = piece[y][x]
          }
        }
      }

      // Check for completed lines
      let linesCleared = 0
      for (let y = ROWS - 1; y >= 0; y--) {
        if (newGrid[y].every((cell) => cell !== 0)) {
          // Remove the line
          newGrid.splice(y, 1)
          // Add a new empty line at the top
          newGrid.unshift(Array(COLS).fill(0))
          linesCleared++
          y++ // Check the same row again
        }
      }

      // Update score and level
      if (linesCleared > 0) {
        // Play line clear sound
        if (settings.enableMusic) {
          lineClearAudioRef.current?.play().catch((e) => console.log("Audio playback prevented:", e))
        }

        const linePoints = [0, 40, 100, 300, 1200] // Points for 0, 1, 2, 3, 4 lines
        setScore((prev) => prev + linePoints[linesCleared] * level)
        setLines((prev) => {
          const newLines = prev + linesCleared
          // Level up every 10 lines
          if (Math.floor(newLines / 10) > Math.floor(prev / 10)) {
            setLevel((prev) => prev + 1)
            dropTimeRef.current = Math.max(100, 1000 - level * 100)
          }
          return newLines
        })
      }

      setGrid(newGrid)

      // Generate new piece
      setPiece(nextPiece)
      setNextPiece(SHAPES[Math.floor(Math.random() * SHAPES.length)])
      setPosition({
        x: Math.floor(COLS / 2) - Math.floor(nextPiece[0].length / 2),
        y: 0,
      })
    }
  }, [
    piece,
    position,
    grid,
    checkCollision,
    paused,
    gameOver,
    level,
    nextPiece,
    gameStarted,
    score,
    highScore,
    settings.enableMusic,
    ROWS,
    COLS,
  ])

  // Hard drop
  const hardDrop = useCallback(() => {
    if (paused || gameOver || !gameStarted) return

    let newY = position.y
    while (!checkCollision(piece, { ...position, y: newY + 1 })) {
      newY++
    }
    setPosition({ ...position, y: newY })

    // Play sound effect
    if (settings.enableMusic) {
      audioRef.current?.play().catch((e) => console.log("Audio playback prevented:", e))
    }
  }, [piece, position, checkCollision, paused, gameOver, gameStarted, settings.enableMusic])

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const nextCanvas = nextPieceCanvasRef.current
    if (!canvas || !nextCanvas) return

    const ctx = canvas.getContext("2d")
    const nextCtx = nextCanvas.getContext("2d")
    if (!ctx || !nextCtx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height)

    // Draw grid background
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#d0d0d0"
    ctx.lineWidth = 0.5

    // Vertical lines
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath()
      ctx.moveTo(x * BLOCK_SIZE, 0)
      ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * BLOCK_SIZE)
      ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE)
      ctx.stroke()
    }

    // Draw grid
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (grid[y][x] !== 0) {
          ctx.fillStyle = COLORS[grid[y][x]]
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
          ctx.strokeStyle = "#000"
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)

          // Add 3D effect
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
          ctx.beginPath()
          ctx.moveTo(x * BLOCK_SIZE, y * BLOCK_SIZE)
          ctx.lineTo((x + 1) * BLOCK_SIZE, y * BLOCK_SIZE)
          ctx.lineTo(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE)
          ctx.fill()

          ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
          ctx.beginPath()
          ctx.moveTo((x + 1) * BLOCK_SIZE, y * BLOCK_SIZE)
          ctx.lineTo((x + 1) * BLOCK_SIZE, (y + 1) * BLOCK_SIZE)
          ctx.lineTo(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE)
          ctx.fill()
        }
      }
    }

    // Draw current piece
    if (piece.length > 0) {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] !== 0) {
            const posX = (position.x + x) * BLOCK_SIZE
            const posY = (position.y + y) * BLOCK_SIZE

            if (posY >= 0) {
              // Only draw if visible
              ctx.fillStyle = COLORS[piece[y][x]]
              ctx.fillRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE)
              ctx.strokeStyle = "#000"
              ctx.strokeRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE)

              // Add 3D effect
              ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
              ctx.beginPath()
              ctx.moveTo(posX, posY)
              ctx.lineTo(posX + BLOCK_SIZE, posY)
              ctx.lineTo(posX, posY + BLOCK_SIZE)
              ctx.fill()

              ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
              ctx.beginPath()
              ctx.moveTo(posX + BLOCK_SIZE, posY)
              ctx.lineTo(posX + BLOCK_SIZE, posY + BLOCK_SIZE)
              ctx.lineTo(posX, posY + BLOCK_SIZE)
              ctx.fill()
            }
          }
        }
      }

      // Draw ghost piece (shadow of where piece will land)
      if (!paused && !gameOver) {
        let ghostY = position.y
        while (!checkCollision(piece, { x: position.x, y: ghostY + 1 })) {
          ghostY++
        }

        for (let y = 0; y < piece.length; y++) {
          for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x] !== 0) {
              const posX = (position.x + x) * BLOCK_SIZE
              const posY = (ghostY + y) * BLOCK_SIZE

              if (posY >= 0 && ghostY > position.y) {
                // Only draw if visible and not overlapping with actual piece
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
                ctx.fillRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE)
                ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
                ctx.strokeRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE)
              }
            }
          }
        }
      }
    }

    // Draw next piece
    if (nextPiece.length > 0) {
      // Clear next piece canvas with background
      nextCtx.fillStyle = "#f0f0f0"
      nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height)

      const offsetX = nextCanvas.width / 2 - (nextPiece[0].length * BLOCK_SIZE) / 2
      const offsetY = nextCanvas.height / 2 - (nextPiece.length * BLOCK_SIZE) / 2

      for (let y = 0; y < nextPiece.length; y++) {
        for (let x = 0; x < nextPiece[y].length; x++) {
          if (nextPiece[y][x] !== 0) {
            nextCtx.fillStyle = COLORS[nextPiece[y][x]]
            nextCtx.fillRect(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
            nextCtx.strokeStyle = "#000"
            nextCtx.strokeRect(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)

            // Add 3D effect
            nextCtx.fillStyle = "rgba(255, 255, 255, 0.3)"
            nextCtx.beginPath()
            nextCtx.moveTo(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE)
            nextCtx.lineTo(offsetX + (x + 1) * BLOCK_SIZE, offsetY + y * BLOCK_SIZE)
            nextCtx.lineTo(offsetX + x * BLOCK_SIZE, offsetY + (y + 1) * BLOCK_SIZE)
            nextCtx.fill()

            nextCtx.fillStyle = "rgba(0, 0, 0, 0.2)"
            nextCtx.beginPath()
            nextCtx.moveTo(offsetX + (x + 1) * BLOCK_SIZE, offsetY + y * BLOCK_SIZE)
            nextCtx.lineTo(offsetX + (x + 1) * BLOCK_SIZE, offsetY + (y + 1) * BLOCK_SIZE)
            nextCtx.lineTo(offsetX + x * BLOCK_SIZE, offsetY + (y + 1) * BLOCK_SIZE)
            nextCtx.fill()
          }
        }
      }
    }

    // Draw game over or paused text
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${deviceType === "mobile" ? "16px" : "20px"} "MS Sans Serif", sans-serif`
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 15)
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15)
      ctx.fillText("Press Start to play again", canvas.width / 2, canvas.height / 2 + 45)
    } else if (paused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${deviceType === "mobile" ? "16px" : "20px"} "MS Sans Serif", sans-serif`
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2)
    }
  }, [grid, piece, position, nextPiece, gameOver, paused, BLOCK_SIZE, checkCollision, score, ROWS, COLS, deviceType])

  // Game loop
  const gameLoop = useCallback(
    (time: number) => {
      requestRef.current = requestAnimationFrame(gameLoop)

      if (!lastTimeRef.current) {
        lastTimeRef.current = time
      }

      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time

      if (!paused && !gameOver && gameStarted) {
        dropCounterRef.current += deltaTime
        if (dropCounterRef.current > dropTimeRef.current) {
          dropPiece()
          dropCounterRef.current = 0
        }
      }

      draw()
    },
    [draw, dropPiece, paused, gameOver, gameStarted],
  )

  // Initialize game
  useEffect(() => {
    // Set up canvas
    const canvas = canvasRef.current
    const nextCanvas = nextPieceCanvasRef.current
    if (canvas && nextCanvas) {
      canvas.width = COLS * BLOCK_SIZE
      canvas.height = ROWS * BLOCK_SIZE
      nextCanvas.width = 6 * BLOCK_SIZE
      nextCanvas.height = 6 * BLOCK_SIZE
    }

    // Draw initial state
    draw()
  }, [draw, BLOCK_SIZE, ROWS, COLS])

  // Start game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [gameLoop])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return

      switch (e.key) {
        case "ArrowLeft":
          movePiece(-1)
          break
        case "ArrowRight":
          movePiece(1)
          break
        case "ArrowDown":
          dropPiece()
          break
        case "ArrowUp":
          rotatePiece()
          break
        case " ":
          hardDrop()
          break
        case "p":
        case "P":
          setPaused((prev) => !prev)
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [movePiece, dropPiece, rotatePiece, hardDrop, gameStarted])

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameStarted || paused || gameOver) return

    const touch = e.touches[0]
    setTouchStartX(touch.clientX)
    setTouchStartY(touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted || paused || gameOver || touchStartX === null || touchStartY === null) return

    e.preventDefault()
    const touch = e.touches[0]
    const diffX = touch.clientX - touchStartX
    const diffY = touch.clientY - touchStartY

    // Require a minimum swipe distance to trigger movement
    const minSwipeDistance = 20

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      // Horizontal swipe
      if (diffX > 0) {
        movePiece(1) // Right
      } else {
        movePiece(-1) // Left
      }
      setTouchStartX(touch.clientX)
      setTouchStartY(touch.clientY)
    } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
      // Vertical swipe
      if (diffY > 0) {
        dropPiece() // Down
      } else {
        hardDrop() // Up (hard drop)
      }
      setTouchStartX(touch.clientX)
      setTouchStartY(touch.clientY)
    }
  }

  const handleTouchEnd = () => {
    setTouchStartX(null)
    setTouchStartY(null)
  }

  const handleDoubleTap = () => {
    if (!gameStarted || paused || gameOver) return
    rotatePiece()
  }

  return (
    <div className="p-2 sm:p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Tetris</h2>
      <div className={`flex ${deviceType === "mobile" ? "flex-col" : "flex-col md:flex-row"} gap-2 sm:gap-4 h-full`}>
        <div className="flex-1 flex flex-col items-center">
          <div
            className="border-2 border-gray-400 mb-4 bg-gray-100"
            style={{
              boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #0a0a0a, inset -2px -2px white, inset 2px 2px grey",
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleTap}
          >
            <canvas ref={canvasRef} className="block" width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} />
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              className="win98-button bg-gray-300 text-black hover:bg-gray-200"
              onClick={() => {
                if (gameOver || !gameStarted) {
                  initGame()
                } else {
                  setPaused((prev) => !prev)
                }
              }}
            >
              {gameOver || !gameStarted ? (
                <Play size={16} className="mr-1" />
              ) : paused ? (
                <Play size={16} className="mr-1" />
              ) : (
                <Pause size={16} className="mr-1" />
              )}
              {gameOver || !gameStarted ? "Start" : paused ? "Resume" : "Pause"}
            </Button>

            <Button className="win98-button bg-gray-300 text-black hover:bg-gray-200" onClick={initGame}>
              <RotateCw size={16} className="mr-1" />
              Restart
            </Button>
          </div>

          {/* Controls - Show on mobile and tablet */}
          <div className={`grid grid-cols-3 gap-2 w-full max-w-xs ${deviceType === "desktop" ? "md:hidden" : ""}`}>
            <Button
              className="win98-button bg-gray-300 text-black hover:bg-gray-200"
              onClick={() => movePiece(-1)}
              disabled={paused || gameOver || !gameStarted}
            >
              <ArrowLeft size={16} />
            </Button>
            <Button
              className="win98-button bg-gray-300 text-black hover:bg-gray-200"
              onClick={dropPiece}
              disabled={paused || gameOver || !gameStarted}
            >
              <ArrowDown size={16} />
            </Button>
            <Button
              className="win98-button bg-gray-300 text-black hover:bg-gray-200"
              onClick={() => movePiece(1)}
              disabled={paused || gameOver || !gameStarted}
            >
              <ArrowRight size={16} />
            </Button>
            <Button
              className="win98-button bg-gray-300 text-black hover:bg-gray-200 col-span-2"
              onClick={hardDrop}
              disabled={paused || gameOver || !gameStarted}
            >
              Hard Drop
            </Button>
            <Button
              className="win98-button bg-gray-300 text-black hover:bg-gray-200"
              onClick={rotatePiece}
              disabled={paused || gameOver || !gameStarted}
            >
              <RotateCw size={16} />
            </Button>
          </div>
        </div>

        <div className={`w-full ${deviceType === "mobile" ? "mt-4" : "md:w-48"} space-y-2 sm:space-y-4`}>
          <div
            className="bg-gray-100 p-4 border-2 border-gray-400"
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
            }}
          >
            <h3 className="text-lg font-bold mb-2 text-black">Next Piece</h3>
            <div
              className="border-2 border-gray-400 bg-gray-200 mx-auto"
              style={{
                boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #0a0a0a, inset -2px -2px white, inset 2px 2px grey",
              }}
            >
              <canvas ref={nextPieceCanvasRef} className="block" width={6 * BLOCK_SIZE} height={6 * BLOCK_SIZE} />
            </div>
          </div>

          <div
            className="bg-gray-100 p-4 border-2 border-gray-400"
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
            }}
          >
            <h3 className="text-lg font-bold mb-2 text-black">Stats</h3>
            <div className="space-y-2 text-black">
              <div className="flex justify-between">
                <span>Score:</span>
                <span>{score}</span>
              </div>
              <div className="flex justify-between">
                <span>High Score:</span>
                <span>{highScore}</span>
              </div>
              <div className="flex justify-between">
                <span>Level:</span>
                <span>{level}</span>
              </div>
              <div className="flex justify-between">
                <span>Lines:</span>
                <span>{lines}</span>
              </div>
            </div>
          </div>

          <div
            className="bg-gray-100 p-4 border-2 border-gray-400"
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
            }}
          >
            <h3 className="text-lg font-bold mb-2 text-black">Controls</h3>
            <div className="space-y-1 text-sm text-black">
              <div className="flex justify-between">
                <span>←/→:</span>
                <span>Move</span>
              </div>
              <div className="flex justify-between">
                <span>↓:</span>
                <span>Soft Drop</span>
              </div>
              <div className="flex justify-between">
                <span>↑:</span>
                <span>Rotate</span>
              </div>
              <div className="flex justify-between">
                <span>Space:</span>
                <span>Hard Drop</span>
              </div>
              <div className="flex justify-between">
                <span>P:</span>
                <span>Pause</span>
              </div>
              {deviceType === "mobile" && (
                <div className="flex justify-between">
                  <span>Double Tap:</span>
                  <span>Rotate</span>
                </div>
              )}
              {deviceType === "mobile" && (
                <div className="flex justify-between">
                  <span>Swipe:</span>
                  <span>Move/Drop</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

