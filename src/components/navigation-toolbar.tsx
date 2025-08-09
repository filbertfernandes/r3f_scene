'use client'

import { useCallback, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Rnd } from 'react-rnd'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import { useKeyboardControls } from '@react-three/drei'
import controls from '@/constants/controls'

interface ControlsInterfaceProps {
  setCameraPosition: (pos: [number, number, number]) => void
  setUseOrtho: React.Dispatch<React.SetStateAction<boolean>>
  isTransform: boolean
  isChangePivot: boolean
  setIsTransform: React.Dispatch<React.SetStateAction<boolean>>
  setIsChangePivot: React.Dispatch<React.SetStateAction<boolean>>
}

type ButtonAction = 
  | { type: 'position', position: [number, number, number] }
  | { type: 'fit' }
  | { type: 'reset' }
  | { type: 'toggle', feature: string }

const getViewButtons = (theme: string):  Array<{ id: string, icon: string, action: ButtonAction, tooltip: string }> => [
  { id: 'orthographic', icon: `/icons/${theme}/iso.svg`, action: { type: 'position', position: [3, 3, 3] }, tooltip: 'Orthographic View' },
  { id: 'front', icon: `/icons/${theme}/front.svg`, action: { type: 'position', position: [0, 0, 5] }, tooltip: 'Front View' },
  { id: 'rear', icon: `/icons/${theme}/rear.svg`, action: { type: 'position', position: [0, 0, -5] }, tooltip: 'Rear View' },
  { id: 'left', icon: `/icons/${theme}/left.svg`, action: { type: 'position', position: [-5, 0, 0] }, tooltip: 'Left View' },
  { id: 'right', icon: `/icons/${theme}/right.svg`, action: { type: 'position', position: [5, 0, 0] }, tooltip: 'Right View' },
  { id: 'top', icon: `/icons/${theme}/top.svg`, action: { type: 'position', position: [0, 5, 0] }, tooltip: 'Top View' },
  { id: 'bottom', icon: `/icons/${theme}/bottom.svg`, action: { type: 'position', position: [0, -5, 0] }, tooltip: 'Bottom View' },
  { id: 'fit', icon: `/icons/${theme}/resize.svg`, action: { type: 'fit' }, tooltip: 'Fit to Screen' },
  { id: 'transparent', icon: `/icons/${theme}/transparent.svg`, action: { type: 'toggle', feature: 'transparent' }, tooltip: 'Toggle Transparency' },
  { id: 'wireframe', icon: `/icons/${theme}/black_edges.svg`, action: { type: 'toggle', feature: 'wireframe' }, tooltip: 'Toggle Wireframe' },
  { id: 'grid', icon: `/icons/${theme}/grid.svg`, action: { type: 'toggle', feature: 'grid' }, tooltip: 'Toggle Grid' },
  { id: 'axes', icon: `/icons/${theme}/axes.svg`, action: { type: 'toggle', feature: 'axes' }, tooltip: 'Toggle Axes' },
  { id: 'axes0', icon: `/icons/${theme}/axes0.svg`, action: { type: 'toggle', feature: 'axes0' }, tooltip: 'Toggle Origin Axes' },
  { id: 'perspective', icon: `/icons/${theme}/perspective.svg`, action: { type: 'toggle', feature: 'perspective' }, tooltip: 'Toggle Perspective' },
  { id: 'extrude', icon: `/icons/${theme}/plane.svg`, action: { type: 'toggle', feature: 'extrude' }, tooltip: 'Extrude Mode' },
]

// External toolbar component that renders outside Canvas
export const NavigationToolbar: React.FC<ControlsInterfaceProps> = ({ setCameraPosition, setUseOrtho, isTransform, isChangePivot, setIsTransform, setIsChangePivot }) =>  {
  const { theme, setTheme } = useTheme()
  const currentTheme = theme === 'light' ? 'light' : 'dark'
  const viewButtons = getViewButtons(currentTheme)

  const handleAction = (action: ButtonAction) => {
    switch (action.type) {
      case 'position':
        setCameraPosition(action.position)
        break
      case 'reset':
        setCameraPosition([3, 3, 3])
        break
      case 'toggle':
        if (action.feature === 'perspective') {
          setUseOrtho((prev) => !prev)
        } else if (action.feature === 'axes') {
          setIsTransform((prev) => !prev)
        } else if (action.feature === 'axes0') {
          setIsChangePivot((prev) => !prev)
        }
        break
    }
    return
  }

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  // Keyboard controls 
  const frontShortcutKey = useKeyboardControls((state) => state[controls.FRONT])
  const backShortcutKey = useKeyboardControls((state) => state[controls.BACK])
  const leftShortcutKey = useKeyboardControls((state) => state[controls.LEFT])
  const rightShortcutKey = useKeyboardControls((state) => state[controls.RIGHT])
  const topShortcutKey = useKeyboardControls((state) => state[controls.TOP])
  const bottomShortcutKey = useKeyboardControls((state) => state[controls.BOTTOM])
  const orthoShortcutKey = useKeyboardControls((state) => state[controls.ORTHO])
  const transformShortcutKey = useKeyboardControls((state) => state[controls.TRANSFORM])

  useEffect(() => {
    if (frontShortcutKey) {
      setCameraPosition([0, 0, 5])
      setUseOrtho(false)
    } else if (backShortcutKey) {
      setCameraPosition([0, 0, -5])
      setUseOrtho(false)
    } else if (leftShortcutKey) {
      setCameraPosition([-5, 0, 0])
      setUseOrtho(false)
    } else if (rightShortcutKey) {
      setCameraPosition([5, 0, 0])
      setUseOrtho(false)
    } else if (topShortcutKey) {
      setCameraPosition([0, 5, 0])
      setUseOrtho(false)
    } else if (bottomShortcutKey) {
      setCameraPosition([0, -5, 0])
      setUseOrtho(false)
    } else if (orthoShortcutKey) {
      setCameraPosition([3, 3, 3])
      setUseOrtho((prev) => !prev)
    }

    if (transformShortcutKey) {
      setIsTransform((prev) => !prev)
    }

  }, [
    frontShortcutKey,
    backShortcutKey,
    leftShortcutKey,
    rightShortcutKey,
    topShortcutKey,
    bottomShortcutKey,
    orthoShortcutKey,
    transformShortcutKey,
    setCameraPosition,
    setUseOrtho,
    setIsTransform
  ])

  return (
      <Rnd
        default={{
          x: typeof window !== 'undefined' ? window.innerWidth - 80 : 800,
          y: 16,
          width: 66,
          height: 'auto',
        }}
        enableResizing={false}
        bounds="parent"
        dragHandleClassName="drag-handle"
        style={{ zIndex: 100 }}
      >
        <div className="w-full h-auto shadow-lg p-1 drag-handle cursor-move border border-border/50 rounded-lg bg-card">
          <div className="flex flex-col space-y-1 items-center justify-center">
            {/* Theme Toggle Button - at the top, spans both columns */}
            <div className="w-full flex justify-center">
              <button
                className="w-6 h-6 hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon className="h-6 w-6" />
                ) : (
                  <Sun className="h-6 w-6" />
                )}
              </button>
            </div>
            
            {/* Navigation Buttons in 2-column grid */}
            <div className="grid grid-cols-2 gap-1">
              {viewButtons.map((button) => (
                <button
                  key={button.id}
                  className="w-7 h-7 p-0 hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
                  onClick={() => handleAction(button.action)}
                  title={button.tooltip}
                >
                  <Image
                    src={button.icon}
                    alt={button.id}
                    width={22}
                    height={22}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Rnd>
  )
}