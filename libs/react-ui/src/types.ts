import * as React from "react";

export type IconAttributes = React.SVGProps<SVGSVGElement> & React.HTMLProps<SVGSVGElement>

export const KreyolLanguages = {
	gp: 'gp',
	mq: 'mq',
	ht: 'ht'
}as const;

export type KreyolLanguage = (typeof KreyolLanguages)[keyof typeof KreyolLanguages]