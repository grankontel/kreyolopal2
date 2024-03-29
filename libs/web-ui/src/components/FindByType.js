import React from 'react'

export const findAllByType = (children, component) => {
  const result = []
  /* This is the array of result since Article can have multiple times the same sub-component */
  const type = [component.componentName]

  /* We can store the actual name of the component through the displayName or name property of our sub-component */
  React.Children.forEach(children, (child) => {
    const childType = child?.type?.componentName
    if (childType !== undefined && type.includes(childType)) {
      result.push(child)
    }
  })
  /* Then we go through each React children, if one of matches the name of the sub-component we’re looking for we put it in the result array */
  return result
}

export const findByType = (children, component) => {
  const result = findAllByType(children, component)
  return result[0]
}
