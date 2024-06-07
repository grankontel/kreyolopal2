import React, { useEffect, ReactNode } from 'react'

import {
  Unsubscribe,
  AbilityTuple,
  SubjectType,
  AnyAbility,
  Generics,
  Abilities,
  IfString,
} from '@casl/ability'

const noop = () => {}

type AbilityCanProps<
  T extends Abilities,
  Else = IfString<T, { do: T } | { I: T }>,
> = T extends AbilityTuple
  ?
      | { do: T[0]; on: T[1]; field?: string }
      | { I: T[0]; a: Extract<T[1], SubjectType>; field?: string }
      | { I: T[0]; an: Extract<T[1], SubjectType>; field?: string }
      | { I: T[0]; this: Exclude<T[1], SubjectType>; field?: string }
  : Else

interface CanBasicProps {
  do: string
  on: string
  field?: string
}
interface ExtraProps {
  not?: boolean
  passThrough?: boolean
}

interface CanExtraProps<T extends AnyAbility> extends ExtraProps {
  ability: T
  children: ReactNode | ((isAllowed: boolean, ability: T) => ReactNode)
}

interface BoundCanExtraProps<T extends AnyAbility> extends ExtraProps {
  ability?: T
  children: ReactNode | ((isAllowed: boolean, ability: T) => ReactNode)
}

export type CanProps<T extends AnyAbility> = AbilityCanProps<Generics<T>['abilities']> &
  CanExtraProps<T>
export type BoundCanProps<T extends AnyAbility> = AbilityCanProps<
  Generics<T>['abilities']
> &
  BoundCanExtraProps<T>

export function Can<T extends AnyAbility, IsBound extends boolean = false>(
  props: CanBasicProps & CanExtraProps<T>
) {
  let _isAllowed: boolean = false

  function _canRender(): boolean {
    //const props: any = this.props;
    const can = props.not ? 'cannot' : 'can'

    if (props.ability === undefined) 
      return false

    return props.ability[can](props.do, props.on, props.field)
  }

  function _renderChildren() {
    const { children, ability } = props
    const elements =
      typeof children === 'function' ? children(_isAllowed, ability as any) : children

    return elements as ReactNode
  }

  _isAllowed = _canRender()
  return props.passThrough || _isAllowed ? _renderChildren() : null
}
