export interface GeoJsonType {
  features: {
    geometry: {
      coordinates: number[][] | number[]
      type: string
    },
    properties: {
      name: string
      color?: string
    }
    type: string
  }[]
  type: string
}