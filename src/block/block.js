/**
 * BLOCK: jma-block-post
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
/**
 * External dependencies
 */
import { getCategories, setCategories } from '@wordpress/blocks';
import { JMALogo, BlockLogo } from '../jma-svg-logos';
/**
  * Internal dependencies
  */
setCategories( [
	...getCategories().filter( ( { slug } ) => slug !== 'jma-blocks' ),
	{ slug: 'jma-blocks', title: 'JMA Blocks', icon: JMALogo },
] );
//  Import CSS.
import './editor.scss';
import './style.scss';
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
//Internal dependencies
import metadata from './block.json';
const { title, category, keywords, styles, attributes } = metadata;
//Edit dependency
import edit from './edit';
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'jma/block-post', {
	title,
	icon: BlockLogo,
	category,
	keywords,
	styles,
	attributes,
	edit,
	save: () => null, // to use block.php
} );
