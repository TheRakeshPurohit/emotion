import * as React from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/react'
import { render, unmountComponentAtNode } from 'react-dom'
import { Global, css } from '@emotion/react'

beforeEach(() => {
  document.head.innerHTML = ''
  document.body.innerHTML = `<div id="root"></div>`
})

gate({ development: false }, ({ test }) => {
  test('basic', () => {
    render(
      <React.Fragment>
        <div css={{ color: 'hotpink' }} />
        <Global
          styles={css`
            @import url('https://some-url');

            h1 {
              color: hotpink;
            }
          `}
        />
      </React.Fragment>,
      document.getElementById('root')
    )
    expect(document.head).toMatchSnapshot()
    expect(document.body).toMatchSnapshot()
    let elements = document.querySelectorAll('style')
    let rules = []
    for (let element of elements) {
      for (let cssRule of element.sheet.cssRules) {
        rules.push(cssRule.cssText)
      }
    }
    expect(rules).toMatchInlineSnapshot(`
    [
      "@import url(https://some-url);",
      "h1 {color: hotpink;}",
      ".css-1lrxbo5 {color: hotpink;}",
    ]
  `)
    unmountComponentAtNode(document.getElementById('root'))
    expect(document.head).toMatchSnapshot()
    expect(document.body).toMatchSnapshot()
  })
})
