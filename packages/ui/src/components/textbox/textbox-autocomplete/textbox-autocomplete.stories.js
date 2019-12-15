/** @jsx h */
import { h } from 'preact'
import { useState } from 'preact/hooks'
import { TextboxAutocomplete } from './textbox-autocomplete'

export default { title: 'Textbox Autocomplete' }

const options = [
  { value: 'foo' },
  { value: 'bar' },
  { value: 'baz' },
  { separator: true },
  { header: 'Header' },
  { value: 'qux' },
  { value: 'quux' },
  { value: 'quuux' },
  { value: 'quuuux' },
  { value: 'quuuuux' }
]

export const Normal = function () {
  function Component () {
    const [value, setValue] = useState('')
    return (
      <TextboxAutocomplete
        value={value}
        options={options}
        onChange={setValue}
      />
    )
  }
  return <Component />
}

export const WithInitialValue = function () {
  function Component () {
    const [value, setValue] = useState('baz')
    return (
      <TextboxAutocomplete
        value={value}
        options={options}
        onChange={setValue}
      />
    )
  }
  return <Component />
}

export const Strict = function () {
  function Component () {
    const [value, setValue] = useState('')
    return (
      <TextboxAutocomplete
        strict
        value={value}
        options={options}
        onChange={setValue}
      />
    )
  }
  return <Component />
}

export const Filter = function () {
  function Component () {
    const [value, setValue] = useState('')
    return (
      <TextboxAutocomplete
        filter
        strict
        value={value}
        options={options}
        onChange={setValue}
      />
    )
  }
  return <Component />
}
