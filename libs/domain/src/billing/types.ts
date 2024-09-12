export interface Plan {
  id: string
  object: string
  active: boolean
  amount: number
  amount_decimal: string
  billing_scheme: string
  created: number
  currency: string
  interval: string
  interval_count: number
  livemode: boolean
  product: Product
  usage_type: string
}

export interface Product {
  id: string
  object: string
  active: boolean
  created: number
  default_price: string
  description: string
  images: any[]
  livemode: boolean
  marketing_features: string[]
  name: string
	metatada: {
		order: string
	}
  tax_code: any
  type: string
  unit_label: any
  updated: number
  url: any
}