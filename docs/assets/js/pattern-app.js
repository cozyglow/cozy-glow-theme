$(function () {
	let pattern = new Pattern(new PatternSize($("#width").val(), $("#height").val(), 600, 400))
	pattern.contrast = 2

	function generate() {
		pattern.canvas($("#preview")[0])
	}

	function createColorDropdownElement(patternColor, id, index) {
		patternColor = new PatternColor(patternColor)
		const indexPost = index === undefined ? "" : "-" + index
		const buttonId = "dropdownMenu" + _.upperFirst(id) + "Button" + indexPost
		const inputId = id + "Color" + indexPost

		let $dropdown = $("<div>")
		$dropdown.addClass("dropdown d-inline")

		let $dropdownMenuButton = $("<button>")
		$dropdownMenuButton.attr("type", "button")
		$dropdownMenuButton.attr("id", buttonId)
		$dropdownMenuButton.addClass("btn btn-primary btn-lg dropdown-toggle m-1")
		$dropdownMenuButton.attr("data-toggle", "dropdown")
		$dropdownMenuButton.attr("aria-haspopup", true)
		$dropdownMenuButton.attr("aria-expanded", false)

		let $dropdownMenu = $("<div>")
		$dropdownMenu.addClass("dropdown-menu p-1")
		$dropdownMenu.attr("aria-labelledby", buttonId)

		let $formGroup = $("<div>")
		$formGroup.addClass("form-group")

		let $colorLabel = $("<label>")
		$colorLabel.attr("for", inputId)
		$colorLabel.text("Colour")

		let $colorInput = $("<input>")
		$colorInput.attr("type", "text")
		$colorInput.attr("id", inputId)
		$colorInput.addClass("form-control")
		$colorInput.attr("placeholder", "Colour")
		$colorInput.val(patternColor.hex())

		$dropdown.append($dropdownMenuButton)
		$dropdown.append($dropdownMenu)

		$dropdownMenu.append($formGroup)

		$formGroup.append($colorLabel)
		$formGroup.append($colorInput)

		updateColorDropdownElementColor($dropdown, patternColor)

		$dropdownMenuButton.dropdown()

		return $dropdown
	}

	function updateColorDropdownElementColor($colorDropdown, patternColor) {
		patternColor = new PatternColor(patternColor)

		let $button = $colorDropdown.find("button")
		$button.css("backgroundColor", patternColor.css())
		$button.css("borderColor", patternColor.darken().css())
	}

	function updatePaletteView(axis) {
		const disable = pattern[axis + "Palette"].length < 1 ? true : false

		$("#" + axis + "ColorOptions [value='palette']").parent().button("toggle")

		$("#remove" + axis.toUpperCase() + "PaletteColor").prop("disabled", disable)
	}

	function createPaletteColorView(axis, color) {
		const index = pattern[axis + "Palette"].length - 1

		let $palette = $("#" + axis + "Palette")

		let $colorDropdown = createColorDropdownElement(color, axis, index)

		$palette.append($colorDropdown)

		$colorDropdown.hide().fadeIn()

		$colorDropdown.find("input").on("change", function () {
			onPaletteColorChange(axis, index)
		})

		updatePaletteView(axis)
	}

	function updatePaletteColorView(axis, index, color) {
		let $colorDropdown = $("#dropdownMenu" + axis.toUpperCase() + "Button-" + index).closest(".dropdown")
		updateColorDropdownElementColor($colorDropdown, color)

		$("#" + axis + "ColorOptions [value='palette']").parent().button("toggle")
	}

	function deleteLastPaletteColorView(axis) {
		$("#" + axis + "Palette").children().last().remove()
		updatePaletteView(axis)
	}

	function createForegroundColorView(color) {
		let $foregroundColor = $("#foregroundColorContainer")

		let $colorDropdown = createColorDropdownElement(color, "foreground")

		$foregroundColor.append($colorDropdown)

		$colorDropdown.find("input").on("change", function () {
			onForegroundColorChange()
		})
	}

	function updateForegroundColorView(color) {
		let $colorDropdown = $("#foregroundColor").closest(".dropdown")
		updateColorDropdownElementColor($colorDropdown, color)

		$("#foregroundColorOptions [value='color']").parent().button("toggle")
	}

	function onSizeChange(side, size) {
		pattern.size[side] = size
		pattern.generate()
		generate()
	}

	function onColorOptionChange(axis, colorOption) {
		pattern[axis + "ColorOption"] = colorOption
		generate()
	}

	function onAddPaletteColor(axis) {
		pattern[axis + "Palette"].push()
		createPaletteColorView(axis, pattern[axis + "Palette"].last())
		pattern.generate()
		generate()
	}

	function onRemovePaletteColor(axis) {
		pattern[axis + "Palette"].pop()
		deleteLastPaletteColorView(axis)
		pattern.generate()
		generate()
	}

	function onPaletteColorChange(axis, index) {
		const color = $("#" + axis + "Color-" + index).val()
		pattern[axis + "Palette"][index] = color
		updatePaletteColorView(axis, index, color)
		pattern.generate()
		generate()
	}

	function onGradientTypeChange(axis, gradientType) {
		pattern[axis + "GradientType"] = gradientType
		generate()
	}

	function onForegroundColorChange() {
		const color = $("#foregroundColor").val()
		pattern.foregroundColor = color
		updateForegroundColorView(color)
	}

	$("#width").on("change", function () {
		onSizeChange("width", $(this).val())
	})

	$("#height").on("change", function () {
		onSizeChange("height", $(this).val())
	})

	$("#xColorOptions").on("change", function () {
		onColorOptionChange("x", $(this).find(":checked").val())
	})

	$("#yColorOptions").on("change", function () {
		onColorOptionChange("y", $(this).find(":checked").val())
	})

	$("#addXPaletteColor").on("click", function () {
		onAddPaletteColor("x")
	})

	$("#addYPaletteColor").on("click", function () {
		onAddPaletteColor("y")
	})

	$("#removeXPaletteColor").on("click", function () {
		onRemovePaletteColor("x")
	})

	$("#removeYPaletteColor").on("click", function () {
		onRemovePaletteColor("y")
	})

	$("#xGradientTypes").on("change", function () {
		onGradientTypeChange("x", $(this).find(":checked").val())
	})

	$("#yGradientTypes").on("change", function () {
		onGradientTypeChange("y", $(this).find(":checked").val())
	})

	$("#foregroundColorOptions").on("change", function () {
		const foregroundColorOption = $(this).find(":checked").val()
		pattern.foregroundColorOption = foregroundColorOption
		generate()
	})

	$("#generate").on("click", function () {
		pattern.generate()
		generate()
	})

	$("#downloadPng").on("click", function (element) {
		const dataUri = pattern.png()
		element.target.href = dataUri
	})

	$("#downloadSvg").on("click", function (element) {
		const svg = pattern.svg()
		const xmlSerializer = new XMLSerializer()
		const svgString = xmlSerializer.serializeToString(svg)
		const base64 = btoa(svgString)
		const dataUri = "data:image/svg+xml;base64," + base64
		element.target.href = dataUri
	})

	generate()
	createForegroundColorView("white")
})
