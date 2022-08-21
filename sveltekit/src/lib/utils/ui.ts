import type {
	UiNodeAttributes,
	UiNodeTextAttributes,
	UiNodeInputAttributes,
	UiNodeImageAttributes,
	UiNodeAnchorAttributes,
	UiNodeScriptAttributes
} from '@ory/kratos-client';

export const isUiNodeTextAttributes = (
	attributes: UiNodeAttributes
): attributes is UiNodeTextAttributes => {
	return (attributes as UiNodeTextAttributes).node_type === 'text';
};

export const isUiNodeInputAttributes = (
	attributes: UiNodeAttributes
): attributes is UiNodeInputAttributes => {
	return (attributes as UiNodeInputAttributes).node_type === 'input';
};

export const isUiNodeImageAttributes = (
	attributes: UiNodeAttributes
): attributes is UiNodeImageAttributes => {
	return (attributes as UiNodeImageAttributes).node_type === 'img';
};

export const isUiNodeAnchorAttributes = (
	attributes: UiNodeAttributes
): attributes is UiNodeAnchorAttributes => {
	return (attributes as UiNodeAnchorAttributes).node_type === 'a';
};

export const isUiNodeScriptAttributes = (
	attributes: UiNodeAttributes
): attributes is UiNodeScriptAttributes => {
	return (attributes as UiNodeScriptAttributes).node_type === 'script';
};
