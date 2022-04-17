import * as THREE from 'three'

type AxesHelperLegend = {
  container: HTMLDivElement;
  xAxisLabel: HTMLDivElement;
  yAxisLabel: HTMLDivElement;
  zAxisLabel: HTMLDivElement;
}

export class AxesHelper extends THREE.AxesHelper {
  private readonly legend: AxesHelperLegend

  public constructor (...args) {
    super(...args)

    const red = new THREE.Color(0xFF0000)
    const limegreen = new THREE.Color(0x32CD32)
    const blue = new THREE.Color(0x0000FF)

    this.legend = AxesHelper.createLegend()
    this.setColors(red, limegreen, blue)
  }

  private static createLegend (): AxesHelperLegend {
    const container = document.createElement('div')
    const xAxisLabel = document.createElement('div')
    const yAxisLabel = document.createElement('div')
    const zAxisLabel = document.createElement('div')

    container.style.background = 'grey'
    container.style.fontFamily = 'monospace'
    container.style.fontSize = '28px'
    container.style.fontWeight = 'bold'
    container.style.padding = '5px 10px'
    container.style.position = 'fixed'
    container.style.right = '0'
    container.style.top = '0'
    xAxisLabel.innerHTML = '&mdash; x-axis &mdash;'
    yAxisLabel.innerHTML = '&mdash; y-axis &mdash;'
    zAxisLabel.innerHTML = '&mdash; z-axis &mdash;'
    container.append(xAxisLabel, yAxisLabel, zAxisLabel)
    document.body.appendChild(container)

    return {
      container,
      xAxisLabel,
      yAxisLabel,
      zAxisLabel,
    }
  }

  public setColors (xAxisColor: THREE.Color, yAxisColor: THREE.Color, zAxisColor: THREE.Color): this {
    this.setLabelColors(xAxisColor.getStyle(), yAxisColor.getStyle(), zAxisColor.getStyle())
    return super.setColors(xAxisColor, yAxisColor, zAxisColor)
  }

  private setLabelColors (xAxisColor: string, yAxisColor: string, zAxisColor: string) {
    this.legend.xAxisLabel.style.color = xAxisColor
    this.legend.yAxisLabel.style.color = yAxisColor
    this.legend.zAxisLabel.style.color = zAxisColor
  }
}
