# Organización

Jerarquía: diócesis → vicarías → parroquias.

`codigo` es un identificador interno de control (no UUID). Lo asigna la BD al crear si no se envía: `D01`, `D01-V01`, `D01-V01-P001`. Se puede indicar un valor explícito si existe un código institucional.

## Diocesis

`id`, `nombre`, `codigo`, campos comunes.

## Vicaria

`diocesisId`, `nombre`, `codigo`, campos comunes.

## Parroquia

`vicariaId`, `nombre`, `codigo`, campos comunes. La solicitud guarda `parroquiaReceptoraId`; la vicaría se obtiene por esta relación.
