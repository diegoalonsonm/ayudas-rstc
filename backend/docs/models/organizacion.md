# Organización

Jerarquía: diócesis → vicarías → parroquias.

## Diocesis

`id`, `nombre`, `codigo`, campos comunes.

## Vicaria

`diocesisId`, `nombre`, `codigo`, campos comunes.

## Parroquia

`vicariaId`, `nombre`, `codigo`, campos comunes. La solicitud guarda `parroquiaReceptoraId`; la vicaría se obtiene por esta relación.
