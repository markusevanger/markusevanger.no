'use client'

import { useState } from 'react'
import { type InputProps, useFormValue } from 'sanity'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

// Replicate button styles from globals.css
const buttonStyles: Record<string, { base: React.CSSProperties; hover: React.CSSProperties }> = {
  primary: {
    base: {
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      outline: 'none',
    },
    hover: {
      backgroundColor: '#991b1b',
      color: 'white',
      border: 'none',
      outline: 'none',
    },
  },
  secondary: {
    base: {
      backgroundColor: 'transparent',
      color: 'black',
      outline: '1px solid currentColor',
    },
    hover: {
      backgroundColor: '#991b1b',
      color: 'white',
      outline: 'none',
    },
  },
  outline: {
    base: {
      backgroundColor: 'transparent',
      color: 'black',
      outline: '1px solid currentColor',
    },
    hover: {
      backgroundColor: '#991b1b',
      color: 'white',
      outline: 'none',
    },
  },
  ghost: {
    base: {
      backgroundColor: 'transparent',
      color: 'black',
      border: 'none',
    },
    hover: {
      backgroundColor: '#f3f4f6',
      color: 'black',
      border: 'none',
    },
  },
}

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  padding: '4px 16px',
  borderRadius: '6px',
  fontSize: '14px',
  cursor: 'pointer',
  height: '32px',
  width: 'fit-content',
  textDecoration: 'none',
  transition: 'background-color 0.2s, color 0.2s',
}

export function ButtonPreview(props: InputProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [arrowOffset, setArrowOffset] = useState({ x: 0, y: 0 })

  // Get the path to the parent button object (remove 'buttonPreview' from the end)
  const parentPath = props.path.slice(0, -1)

  // Read sibling fields using the parent path
  const textEn = useFormValue([...parentPath, 'text_en']) as string | undefined
  const buttonType = useFormValue([...parentPath, 'type']) as string | undefined
  const linkType = useFormValue([...parentPath, 'linkType']) as string | undefined
  const icon = useFormValue([...parentPath, 'icon']) as string | undefined

  const typeStyles = buttonStyles[buttonType || 'primary'] || buttonStyles.primary
  const currentStyles = isHovered ? typeStyles.hover : typeStyles.base

  const style = {
    ...baseStyle,
    ...currentStyles,
  }

  const isInternal = linkType === 'internal'

  const handleMouseEnter = () => {
    setIsHovered(true)
    setArrowOffset(isInternal ? { x: 3, y: 0 } : { x: 2, y: -2 })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setArrowOffset({ x: 0, y: 0 })
  }

  const arrowStyle: React.CSSProperties = {
    transition: 'transform 0.2s ease-out',
    transform: `translate(${arrowOffset.x}px, ${arrowOffset.y}px)`,
  }

  return (
    <div style={{ padding: '16px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span
          style={style}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {icon && <DynamicIcon name={icon as IconName} size={16} />}
          {textEn || 'Button Text'}
          {isInternal ? (
            <ArrowRight size={16} style={arrowStyle} />
          ) : (
            <ArrowUpRight size={16} style={arrowStyle} />
          )}
        </span>
      </div>
    </div>
  )
}
