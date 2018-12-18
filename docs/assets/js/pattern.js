const PatternXColorOption = {
	random: "random",
	palette: "palette"
}

const PatternYColorOption = {
	random: "random",
	matchX: "match_x",
	palette: "palette"
}

const PatternForegroundColorOption = {
	none: "none",
	color: "color"
}

const PatternXGradientType = {
	linear: "linear",
	radial: "radial"
}

const PatternYGradientType = {
	matchX: "match-x",
	linear: "linear",
	radial: "radial"
}

class PatternColor {
	constructor(color) {
		if (color === undefined) color = chroma.random()
		if (color instanceof PatternColor) {
			color = color.color
		} else {
			color = chroma(color)
		}
		this._color = color
	}

	get color() {
		return this._color
	}

	set color(color) {
		this._color = chroma(color)
	}

	isDark() {
		return this.color.luminance < 0.5
	}

	isLight() {
		return this.color.luminance >= 0.5
	}

	setMinimumContrast(color, contrast, value) {
		if (! (color instanceof PatternColor)) {
			color = new PatternColor(color)
		}
		if (contrast === undefined) contrast = 4.5
		if (value === undefined) value = 0.1

		if (chroma.contrast(this.color, color.color) < contrast) {
			let func
			if (this.color.luminance() === color.color.luminance()) {
				func = this.isDark() ? "darken" : "lighten"
			} else {
				func = this.color.luminance() < color.color.luminance() ? "darken" : "lighten"
			}

			while (chroma.contrast(this.color, color.color) < contrast && ! this.color.luminance() !== ("darken" ? 0 : 1)) {
				switch (func) {
					case "darken":
						this.color = this.color.darken(value)
						break
					case "lighten":
						this.color = this.color.brighten(value)
						break
				}
			}
		}
	}

	random() {
		this.color = chroma.random()
	}

	darken(value) {
		return this.color.darken(value)
	}

	brighten(value) {
		return this.color.brighten(value)
	}

	set(channel, value) {
		return this.color.set(channel, value)
	}

	contrast(color) {
		return chroma.contrast(this.color, color)
	}

	css() {
		return this.color.css()
	}

	hex() {
		return this.color.hex()
	}
}

class PatternPalette extends Array {
	constructor(...colors) {
		colors.forEach(function (color, index) {
			if (! (color instanceof PatternColor)) {
				color = new PatternColor(color)
				colors[index] = color
			}
		})

		super(...colors)
	}

	push(color) {
		if (color === undefined) color = new PatternColor()

		if (! (color instanceof PatternColor)) {
			color = new PatternColor(color)
		}

		super.push(color)
	}

	last() {
		return this[this.length - 1]
	}
}

class PatternSize {
	constructor(width, height, minWidth, minHeight) {
		if (minWidth !== undefined) this.minWidth = minWidth
		if (minHeight !== undefined) this.minHeight = minHeight
		this.width = width
		this.height = height
	}

	get width() {
		return this._width
	}

	set width(width) {
		let w = Number(width)
		if (w === 0 || isNaN(w)) w = toPx(width)
		if (this.minWidth && w < this.minWidth) w = this.minWidth
		this._width = w
	}

	get height() {
		return this._height
	}

	set height(height) {
		let h = Number(height)
		if (h === 0 || isNaN(h)) h = toPx(height)
		this._height = h
		if (this.minHeight && h < this.minHeight) h = this.minHeight
		this._height = h
	}

	get minWidth() {
		return this._minWidth
	}

	set minWidth(minWidth) {
		let mW = Number(minWidth)
		if (mW === 0 || isNaN(mW)) mW = toPx(minWidth)
		this._minWidth = mW
	}

	get minHeight() {
		return this._minHeight
	}

	set minHeight(minHeight) {
		let mH = Number(minHeight)
		if (mH === 0 || isNaN(mH)) mH = toPx(minHeight)
		this._minHeight = mH
	}
}

class Pattern {
	constructor(size, variance, seed, xColorOption, yColorOption, xPalette, yPalette, strokeWidth, strokeColor, foregroundColorOption, foregroundColor, contrast, hueShift, xGradientType, yGradientType) {
		this._size = new PatternSize(600, 400)
		this._variance = 1
		this._colorOptions = {
			x: PatternXColorOption.random,
			y: PatternYColorOption.matchX
		}
		this._strokeWidth = 0.1
		this._strokeColor = new PatternColor("black")
		this._palettes = {
			x: new PatternPalette(),
			y: new PatternPalette()
		}
		this._foregroundColorOption = PatternForegroundColorOption.none
		this._foregroundColor = new PatternColor("white")
		this._contrast = 4.5
		this._hueShift = 120
		this._gradientTypes = {
			x: PatternXGradientType.linear,
			y: PatternYGradientType.matchX
		}

		if (size !== undefined) this.size = size
		if (variance !== undefined) this.variance = variance
		if (seed !== undefined) this.seed = seed
		if (xColorOption !== undefined) this.xColorOption = xColorOption
		if (yColorOption !== undefined) this.yColorOption = yColorOption
		if (xPalette !== undefined) this.xPalette = xPalette
		if (yPalette !== undefined) this.yPalette = yPalette
		if (strokeWidth !== undefined) this.strokeWidth = strokeWidth
		if (strokeColor !== undefined) this.strokeColor = strokeColor
		if (foregroundColorOption !== undefined) this.foregroundColorOption = foregroundColorOption
		if (foregroundColor !== undefined) this.foregroundColor = foregroundColor
		if (contrast !== undefined) this.contrast = contrast
		if (hueShift !== undefined) this.hueShift = hueShift
		if (xGradientType !== undefined) this.xGradientType = xGradientType
		if (yGradientType !== undefined) this.yGradientType = yGradientType

		this.generate()
	}

	get size() {
		return this._size
	}

	set size(size) {
		if (! (size instanceof PatternSize)) {
			console.error("Size must be an instance of PatternSize.")
			return
		}

		this._size = size
		this.generate()
	}

	get variance() {
		return this._variance
	}

	set variance(variance) {
		const v = Number(variance)

		if (v === NaN) {
			console.error("Variance must be a number.")
			return
		}

		this._variance(v)
		this.generate()
	}

	get seed() {
		return this._seed
	}

	set seed(seed) {
		this._seed = seed
		this.generate()
	}

	get xColorOption() {
		return this._colorOptions.x
	}

	set xColorOption(xColorOption) {
		const xColorOptions = Object.values(PatternXColorOption)
		if (! xColorOptions.includes(xColorOption)) {
			console.error("X color option must be either: " + xColorOptions.join(", "))
			return
		}

		this._colorOptions.x = xColorOption
		this.generate()
	}

	get yColorOption() {
		return this._colorOptions.y
	}

	set yColorOption(yColorOption) {
		const yColorOptions = Object.values(PatternYColorOption)
		if (! yColorOptions.includes(yColorOption)) {
			console.error("Y color option must be either: " + yColorOptions.join(", "))
			return
		}

		this._colorOptions.y = yColorOption
		this.generate()
	}

	get xPalette() {
		return this._palettes.x
	}

	set xPalette(xPalette) {
		if (! (xPalette instanceof PatternPalette)) {
			if (! typeof xPalette === "Array") {
				console.error("X palette must be an instance of PatternPalette.")
				return
			}

			xPalette = new PatternPalette(xPalette)
		}

		this._palettes.x = xPalette
	}

	get yPalette() {
		return this._palettes.y
	}

	set yPalette(yPalette) {
		if (! (yPalette instanceof PatternPalette)) {
			if (! typeof yPalette === "Array") {
				console.error("Y palette must be an instance of PatternPalette.")
				return
			}

			yPalette = new PatternPalette(yPalette)
		}

		this._palettes.y = yPalette
	}

	get strokeWidth() {
		return this._strokeWidth
	}

	set strokeWidth(strokeWidth) {
		strokeWidth = Number(strokeWidth)

		if (strokeWidth === NaN) {
			console.error("Stroke width must be a number.")
		}

		this._strokeWidth = Number(strokeWidth)
		this.generate()
	}

	get strokeColor() {
		return this._strokeColor
	}

	set strokeColor(color) {
		if (! (color instanceof PatternColor)) {
			color = new PatternColor(color)
		}

		this._strokeColor = color
		this.generate()
	}

	get foregroundColorOption() {
		return this._foregroundColorOption
	}

	set foregroundColorOption(foregroundColorOption) {
		const foregroundColorOptions = Object.values(PatternForegroundColorOption)
		if (! foregroundColorOptions.includes(foregroundColorOption)) {
			console.error("Foreground color option must be either: " + foregroundColorOptions.join(", "))
			return
		}

		this._foregroundColorOption = foregroundColorOption
		this.generate()
	}

	get foregroundColor() {
		return this._foregroundColor
	}

	set foregroundColor(color) {
		if (! (color instanceof PatternColor)) {
			color = new PatternColor(color)
		}

		this._foregroundColor = color
		this.generate()
	}

	get contrast() {
		return this._contrast
	}

	set contrast(contrast) {
		contrast = Number(contrast)

		if (contrast === NaN) {
			console.error("Contrast must be a number.")
			return
		}

		this._contrast = contrast
		this.generate()
	}

	get hueShift() {
		return this._hueShift
	}

	set hueShift(hueShift) {
		hueShift = Number(hueShift)

		if (hueShift === NaN) {
			console.error("Hue shift must be a number.")
			return
		}

		this._hueShift = hueShift
		this.generate()
	}

	get xGradientType() {
		return this._gradientTypes.x
	}

	set xGradientType(xGradientType) {
		const xGradientTypes = Object.values(PatternXGradientType)
		if (! xGradientTypes.includes(xGradientType)) {
			console.error("X gradient type must be either: " + xGradientTypes.join(", "))
			return
		}

		this._gradientTypes.x = xGradientType
		this.generate()
	}

	get yGradientType() {
		return this._gradientTypes.y
	}

	set yGradientType(yGradientType) {
		const yGradientTypes = Object.values(PatternYGradientType)
		if (! yGradientTypes.includes(yGradientType)) {
			console.error("Y gradient type must be either: " + yGradientTypes.join(", "))
			return
		}

		this._gradientTypes.y = yGradientType
		this.generate()
	}

	generate() {
		let config = {
			width: this.size.width,
			height: this.size.height,
			variance: this.variance,
			seed: this.seed,
			x_colors: this.xColorOption,
			y_colors: this.yColorOption,
			stroke_width: this.strokeWidth,
			// stroke_color: this.strokeColor.hex()
		}

		if (this.xColorOption === PatternXColorOption.palette) {
			let xPalette = new PatternPalette(...this.xPalette)

			switch (xPalette.length) {
				case 0:
					const palettes = Object.values(this._pattern.opts.palette)
					const randomIndex = Math.floor(Math.random() * palettes.length)
					xPalette = new PatternPalette(...palettes[randomIndex])
					break
				case 1:
					let colorA = xPalette[0].set("lch.h", "-" + this.hueShift)
					let colorB = xPalette[0].set("lch.h", "+" + this.hueShift)
					xPalette = new PatternPalette(colorA, xPalette[0], colorB)
					break
			}

			if (this.foregroundColorOption === PatternForegroundColorOption.color) {
				for (let color of xPalette) {
					color.setMinimumContrast(this.foregroundColor, this.contrast)
				}
			}

			switch (this.xGradientType) {
				case PatternXGradientType.radial:
					let xGradientPalette = new PatternPalette()
					for (let i = xPalette.length - 1; i >= 0; i--) {
						xGradientPalette.push(xPalette[i])
					}
					for (let i = 1; i < xPalette.length; i++) {
						xGradientPalette.push(xPalette[i])
					}
					xPalette = xGradientPalette
					break
			}

			config.x_colors = xPalette.map(color => color.hex())
		}

		if (this.yColorOption === PatternYColorOption.palette) {
			let yPalette = new PatternPalette(...this.yPalette)

			switch (this.yPalette.length) {
				case 0:
					const palettes = Object.values(this._pattern.opts.palette)
					const randomIndex = Math.floor(Math.random() * palettes.length)
					yPalette = new PatternPalette(...palettes[randomIndex])
					break
				case 1:
					let colorA = yPalette[0].set("lch.h", "-" + this.hueShift)
					let colorB = yPalette[0].set("lch.h", "+" + this.hueShift)
					yPalette = new PatternPalette(colorA, yPalette[0], colorB)
					break
			}

			if (this.foregroundColorOption === PatternForegroundColorOption.color) {
				for (let color of yPalette) {
					color.setMinimumContrast(this.foregroundColor, this.contrast)
				}
			}

			let yGradientType = this.yGradientType
			if (yGradientType === PatternYGradientType.matchX) yGradientType = this.xGradientType

			switch (yGradientType) {
				case PatternYGradientType.radial:
					let yGradientPalette = new PatternPalette()
					for (let i = yPalette.length - 1; i >= 0; i--) {
						yGradientPalette.push(yPalette[i])
					}
					for (let i = 1; i < yPalette.length; i++) {
						yGradientPalette.push(yPalette[i])
					}
					yPalette = yGradientPalette
					break
			}

			config.y_colors = yPalette.map(color => color.hex())
		}

		this._pattern = Trianglify(config)

		if (this.xColorOption === PatternXColorOption.random) {
			let xPalette = new PatternPalette(...this._pattern.opts.x_colors)

			if (this.foregroundColorOption === PatternForegroundColorOption.color) {
				for (let color of xPalette) {
					color.setMinimumContrast(this.foregroundColor, this.contrast)
				}
			}

			config.x_colors = xPalette.map(color => color.hex())
		}

		if (this.yColorOption === PatternYColorOption.random) {
			let yPalette = new PatternPalette(...this._pattern.opts.y_colors)

			if (this.foregroundColorOption === PatternForegroundColorOption.color) {
				for (let color of yPalette) {
					color.setMinimumContrast(this.foregroundColor, this.contrast)
				}
			}

			config.y_colors = yPalette.map(color => color.hex())
		}

		this._pattern = Trianglify(config)
	}

	canvas(element) {
		return this._pattern.canvas(element)
	}

	png() {
		return this._pattern.png()
	}

	svg() {
		return this._pattern.svg()
	}
}
