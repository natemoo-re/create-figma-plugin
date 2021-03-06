/** @jsx h */
import classnames from '@sindresorhus/class-names'
import { cloneElement, h } from 'preact'
import { useCallback, useLayoutEffect, useRef, useState } from 'preact/hooks'

import {
  INVALID_MENU_ITEM_ID,
  MenuItemId as ItemId,
  useScrollableMenu
} from '../../hooks/use-scrollable-menu'
import { OnChange, Option } from '../../types'
import { ENTER_KEY_CODE, ESCAPE_KEY_CODE } from '../../utilities/key-codes'
import { checkIcon } from '../icon/icons/check-icon'
import styles from './dropdown-menu.scss'

const ITEM_ELEMENT_ATTRIBUTE_NAME = 'data-dropdown-menu'

export interface DropdownMenuProps {
  children: preact.ComponentChildren
  focused?: boolean
  fullWidth?: boolean
  name: string
  onChange: OnChange
  options: Option[]
  right?: boolean
  top?: boolean
  value: null | string
}

export type DropdownOption = Option

export function DropdownMenu({
  children,
  focused,
  fullWidth,
  name,
  onChange,
  options,
  right,
  top,
  value
}: DropdownMenuProps): h.JSX.Element {
  const rootElementRef: preact.RefObject<HTMLDivElement> = useRef(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const menuItems: Array<Option> = options.map(function (option, index) {
    return {
      id: `${index}`,
      ...option
    }
  })
  const committedId = getIdByValue(menuItems, value)
  const [selectedId, setSelectedId] = useState(committedId)
  const findOptionById = useCallback(
    function (targetId: string): null | Option {
      const result = menuItems.find(function ({ id }) {
        return id === targetId
      })
      return typeof result === 'undefined' ? null : result
    },
    [menuItems]
  )
  const handleMenuItemClick = useCallback(
    function (event: MouseEvent): void {
      const targetId = (event.target as HTMLElement).getAttribute(
        ITEM_ELEMENT_ATTRIBUTE_NAME
      ) as string
      const option = findOptionById(targetId)
      if (option === null) {
        return
      }
      if ('value' in option) {
        const newValue = option.value
        onChange({ [name]: newValue }, newValue, name, event)
        setIsMenuVisible(false)
      }
    },
    [findOptionById, name, onChange, setIsMenuVisible]
  )
  const {
    menuElementRef,
    handleKeyDown,
    updateScrollPosition
  } = useScrollableMenu({
    changeOnMouseOver: true,
    itemElementAttributeName: ITEM_ELEMENT_ATTRIBUTE_NAME,
    onChange: setSelectedId,
    selectedItemId: selectedId
  })
  const handleClick = useCallback(
    function (event: MouseEvent): void {
      if (
        menuElementRef.current === null ||
        typeof menuElementRef.current === 'undefined' ||
        rootElementRef.current === null ||
        typeof rootElementRef.current === 'undefined' ||
        menuElementRef.current === event.target ||
        menuElementRef.current.contains(event.target as HTMLElement) === true
      ) {
        return
      }
      if (
        rootElementRef.current === event.target ||
        rootElementRef.current.contains(event.target as HTMLElement) === true
      ) {
        setIsMenuVisible(!(isMenuVisible === true))
        updateScrollPosition(`${selectedId}`)
      }
    },
    [
      isMenuVisible,
      menuElementRef,
      selectedId,
      setIsMenuVisible,
      updateScrollPosition
    ]
  )
  const handleRootElementKeyDown = useCallback(
    // Commit the selected value and hide the menu if `Enter` was pressed
    function (event: KeyboardEvent): void {
      if (event.keyCode === ENTER_KEY_CODE) {
        if (selectedId !== INVALID_MENU_ITEM_ID) {
          setSelectedId(selectedId)
          const option = findOptionById(selectedId)
          if (option === null) {
            return
          }
          if ('value' in option) {
            const newValue = option.value
            onChange({ [name]: newValue }, newValue, name, event)
          }
        }
        setIsMenuVisible(false)
        return
      }
      // Hide the menu if `Esc` was pressed
      if (event.keyCode === ESCAPE_KEY_CODE) {
        setIsMenuVisible(false)
        return
      }
      handleKeyDown(event)
    },
    [
      findOptionById,
      handleKeyDown,
      name,
      onChange,
      selectedId,
      setIsMenuVisible,
      setSelectedId
    ]
  )
  const handleWindowClick = useCallback(
    // Hide the menu if we’d clicked outside
    function (event: Event): void {
      if (
        rootElementRef.current === null ||
        typeof rootElementRef.current === 'undefined'
      ) {
        return
      }
      if (
        isMenuVisible === false ||
        rootElementRef.current === event.target ||
        rootElementRef.current.contains(event.target as HTMLElement)
      ) {
        return
      }
      setIsMenuVisible(false)
    },
    [rootElementRef, isMenuVisible, setIsMenuVisible]
  )
  useLayoutEffect(
    function (): () => void {
      window.addEventListener('click', handleWindowClick)
      return function () {
        window.removeEventListener('click', handleWindowClick)
      }
    },
    [handleWindowClick]
  )
  return (
    <div
      ref={rootElementRef as preact.RefObject<HTMLDivElement>}
      class={styles.dropdownMenu}
      data-initial-focus={focused === true}
      onClick={handleClick}
      onKeyDown={handleRootElementKeyDown}
      tabIndex={0}
    >
      {cloneElement(children as preact.VNode<any>, { [name]: value })}
      <div
        class={classnames(
          styles.menu,
          isMenuVisible === false ? styles.hidden : null,
          fullWidth === true ? styles.fullWidth : null,
          right === true ? styles.right : null,
          top === true ? styles.top : null
        )}
      >
        <div ref={menuElementRef as preact.RefObject<HTMLDivElement>}>
          {menuItems.map(function (menuItem) {
            if ('separator' in menuItem) {
              return <hr key={menuItem.id} class={styles.menuSeparator} />
            }
            if ('header' in menuItem) {
              return (
                <h1 key={menuItem.id} class={styles.menuHeader}>
                  {menuItem.header}
                </h1>
              )
            }
            return (
              <div
                key={menuItem.id}
                class={classnames(
                  styles.menuItem,
                  `${menuItem.id}` === selectedId
                    ? styles.menuItemSelected
                    : null
                )}
                onClick={handleMenuItemClick}
                {...{ [ITEM_ELEMENT_ATTRIBUTE_NAME]: menuItem.id }}
              >
                {menuItem.id === committedId ? (
                  <div class={styles.icon}>{checkIcon}</div>
                ) : null}
                {menuItem.value}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function getIdByValue(
  menuItems: Array<Option>,
  targetValue: null | string
): ItemId {
  if (targetValue !== null) {
    for (const menuItem of menuItems) {
      if ('value' in menuItem) {
        const { id, value } = menuItem
        if (value === targetValue) {
          return typeof id === 'undefined' ? null : id
        }
      }
    }
  }
  return INVALID_MENU_ITEM_ID
}
