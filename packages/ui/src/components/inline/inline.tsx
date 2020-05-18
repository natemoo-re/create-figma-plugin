/** @jsx h */
import { h, toChildArray } from 'preact'

import { Space } from '../../types'
import styles from './inline.scss'

export interface InlineProps {
  children: preact.ComponentChildren
  space?: Space
}

export function Inline({
  children,
  space,
  ...rest
}: InlineProps): h.JSX.Element {
  return (
    <div
      {...rest}
      className={typeof space === 'undefined' ? undefined : styles[space]}
    >
      {toChildArray(children).map(function (element, index) {
        return (
          <div className={styles.item} key={index}>
            {element}
          </div>
        )
      })}
    </div>
  )
}
