$(function () {
	function updateConfigColors(axis, colors) {
		config[axis + "_colors"] = colors
		if (_.isArray(colors)) {
			if (palettes[axis].length >= 1) updatePattern(config)
		} else {
			updatePattern(config)
		}
	}

	function createPaletteColor(axis, color) {
		palettes[axis].push(color)
		updateConfigColors(axis, palettes[axis])
		createPaletteColorView(axis, color)
	}

	function updatePaletteColor(axis, index, color) {
		palettes[axis][index] = color
		updateConfigColors(axis, palettes[axis])
		updatePaletteColorView(axis, index, color)
	}

	function deleteLastPaletteColor(axis, color) {
		palettes[axis].pop()
		updateConfigColors(axis, palettes[axis])
		deleteLastPaletteColorView(axis)
	}

	function updatePaletteView(axis) {
		var palette = getPalette(axis)
		var disable = palette.length <= 1 ? true : false
		$("#remove" + _.toUpper(axis) + "Color").prop("disabled", disable)
	}

	function createPaletteColorView(axis, color) {
		var palette = getPalette(axis)
		var index = palette.length - 1

		var $paletteColors = $("#" + axis + "PaletteColors")

		var $colorDropdown = createColorDropdownElement(color, axis, index)

		$paletteColors.append($colorDropdown)

		$colorDropdown.find("input").on("change", function () {
			onPaletteColorChange(axis, index)
		})

		updatePaletteView(axis)
	}

	function updatePaletteColorView(axis, index, color) {
		var $colorDropdown = $("#dropdownMenu" + _.toUpper(axis) + "Button-" + index).parent(".dropdown")
		updateColorDropdownElementColor($colorDropdown, color)
	}

	function deleteLastPaletteColorView(axis) {
		$("#" + axis + "PaletteColors").children().last().remove()
		updatePaletteView(axis)
	}

	function createForegroundColorView(color) {
		var $foregroundColor = $("#foregroundColorContainer")

		var $colorDropdown = createColorDropdownElement(color, "foreground")

		$foregroundColor.append($colorDropdown)

		$colorDropdown.find("input").on("change", function () {
			onForegroundColorChange()
		})
	}

	function updateForegroundColorView(color) {
		var $colorDropdown = $("#foregroundColor").parent(".dropdown")
		updateColorDropdownElementColor($colorDropdown, color)
	}

	function onWidthChange() {
		var width = _.toInteger($("#width").val())
		if (width === 0) width = toPx($("#width").val())
		updateConfigWidth(width)
	}

	function onHeightChange() {
		var height = _.toInteger($("#height").val())
		if (height === 0) height = toPx($("#height ").val())
		updateConfigHeight(height)
	}

	function onPaletteChange(axis) {
		var palette = $("#" + axis + "Palette :checked").val()

		if (palette === "palette") {
			initPaletteColors(axis)
			palette = getPalette(axis)
		}

		updateConfigColors(axis, palette)
	}

	function onPaletteColorChange(axis, index) {
		var color = $("#" + axis + "Color-" + index).val()
		updatePaletteColor(axis, index, color)
	}

	function onAddColorClick(axis) {
		var palette = getPalette(axis)
		if (palette.length === 0) {
			initPaletteColors(axis)
		} else {
			createPaletteColor(axis, _.last(palette))
		}

		$("#" + axis + "Palette [value='palette']").parent().button("toggle")
	}

	function onRemoveColorClick(axis) {
		deleteLastPaletteColor(axis)

		$("#" + axis + "Palette [value='palette']").parent().button("toggle")
	}

	function onForegroundChange() {
		switch ($("#foreground :checked").val()) {
			case "none":
				setForegroundColor(null)
				break
			default:
				var color = $("#foregroundColor").val()
				setForegroundColor(color)
				break
		}
	}

	function onForegroundColorChange() {
		var color = $("#foregroundColor").val()
		setForegroundColor(color)

		$("#foreground [value='color']").parent().button("toggle")
	}

	initForegroundColor()

	onHeightChange()
	onWidthChange()

	$("#width").on("change", function () {
		onWidthChange()
	})

	$("#height").on("change", function () {
		onHeightChange()
	})

	_.forEach([axis.x, axis.y], function (axis) {
		$("#" + axis + "Palette").on("change", function () {
			onPaletteChange(axis)
		})

		$("#add" + _.toUpper(axis) + "Color").on("click", function () {
			onAddColorClick(axis)
		})

		$("#remove" + _.toUpper(axis) + "Color").on("click", function () {
			onRemoveColorClick(axis)
		})
	})

	$("#foreground").on("change", function () {
		onForegroundChange()
	})

	$("#generate").on("click", function () {
		var config = getConfig()
		updatePattern(config)
	})
})
