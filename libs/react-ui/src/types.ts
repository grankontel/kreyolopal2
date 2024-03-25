import * as React from "react";

export type IconAttributes = React.HTMLAttributes<HTMLDivElement> & React.SVGProps<SVGSVGElement>

export const KreyolLanguages = {
	gp: 'gp',
	mq: 'mq',
	ht: 'ht'
}as const;

export type KreyolLanguage = (typeof KreyolLanguages)[keyof typeof KreyolLanguages]