/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
const { addQueryArgs } = wp.url;
const { decodeEntities } = wp.htmlEntities;
const { __ } = wp.i18n;
const {
	SelectControl,
	RangeControl,
	Button,
	TextControl,
} = wp.components;
const { Component } = wp.element;
let IS_SPONSORED_CONTENT_SUPPORTED;
if (
	typeof window === 'object' &&
	window.jmaSponsoredContentGlobalObject &&
	window.jmaSponsoredContentGlobalObject.sponsored_content_support
) {
	IS_SPONSORED_CONTENT_SUPPORTED = true;
}
/**
 * Internal dependencies.
 */
import AutocompleteTokenField from './autocomplete-tokenfield';
class QueryPostControls extends Component {
	state = {
		showAdvancedFilters: false,
	};
	fetchPageSuggestions = () => {
		return apiFetch( {
			path: addQueryArgs( '/wp/v2/search', {
				per_page: 20,
				type: 'post',
				subtype: 'page',

			} ),
		} ).then( function( pages ) {
			return pages.map( page => ( {
				value: page.id,
				label: decodeEntities( page.title ) || __( '(no name)', 'jma-blocks' ),
			} ) );
		} );
	};
	fetchSavedPage = pageIDs => {
		return apiFetch( {
			path: addQueryArgs( '/wp/v2/pages', {
				per_page: 100,
				include: pageIDs.join( ',' ),
				_fields: 'id,title',
			} ),
		} ).then( function( pages ) {
			return pages.map( page => ( {
				value: page.id,
				label: decodeEntities( page.title.rendered ) || __( '(no name)', 'jma-blocks' ),
			} ) );
		} );
	};
	fetchAuthorSuggestions = search => {
		return apiFetch( {
			path: addQueryArgs( '/wp/v2/users', {
				search,
				per_page: 20,
				_fields: 'id,name',
			} ),
		} ).then( function( users ) {
			return users.map( user => ( {
				value: user.id,
				label: decodeEntities( user.name ) || __( '(no name)', 'jma-blocks' ),
			} ) );
		} );
	};
	fetchSavedAuthors = userIDs => {
		return apiFetch( {
			path: addQueryArgs( '/wp/v2/users', {
				per_page: 100,
				include: userIDs.join( ',' ),
				_fields: 'id,name',
			} ),
		} ).then( function( users ) {
			return users.map( user => ( {
				value: user.id,
				label: decodeEntities( user.name ) || __( '(no name)', 'jma-blocks' ),
			} ) );
		} );
	};
	fetchCategorySuggestions = search => {
		return apiFetch( {
			path: addQueryArgs( '/wp/v2/categories', {
				search,
				per_page: 20,
				_fields: 'id,name',
				orderby: 'count',
				order: 'desc',
			} ),
		} ).then( function( categories ) {
			return categories.map( category => ( {
				value: category.id,
				label: decodeEntities( category.name ) || __( '(no title)', 'jma-blocks' ),
			} ) );
		} );
	};
	fetchSavedCategories = categoryIDs => {
		return apiFetch( {
			path: addQueryArgs( '/wp/v2/categories', {
				per_page: 100,
				_fields: 'id,name',
				include: categoryIDs.join( ',' ),
			} ),
		} ).then( function( categories ) {
			return categories.map( category => ( {
				value: category.id,
				label: decodeEntities( category.name ) || __( '(no title)', 'jma-blocks' ),
			} ) );
		} );
	};
	fetchTagSuggestions = search => {
		return apiFetch( {
			path: addQueryArgs( '/wp/v2/tags', {
				search,
				per_page: 20,
				_fields: 'id,name',
				orderby: 'count',
				order: 'desc',
			} ),
		} ).then( function( tags ) {
			return tags.map( tag => ( {
				value: tag.id,
				label: decodeEntities( tag.name ) || __( '(no title)', 'jma-blocks' ),
			} ) );
		} );
	};
	fetchSavedTags = tagIDs => {
		return apiFetch( {
			path: addQueryArgs( '/wp/v2/tags', {
				per_page: 100,
				_fields: 'id,name',
				include: tagIDs.join( ',' ),
			} ),
		} ).then( function( tags ) {
			return tags.map( tag => ( {
				value: tag.id,
				label: decodeEntities( tag.name ) || __( '(no title)', 'jma-blocks' ),
			} ) );
		} );
	};
	render() {
		const {
			postType,
			onPostTypeChange,
			page,
			onPageChange,
			postsToShow,
			onPostToShowChange,
			authors,
			onAuthorsChange,
			categories,
			onCategoriesChange,
			categoriesExclude,
			onCategoriesExcludeChange,
			tags,
			onTagsChange,
			tagsExclude,
			onTagsExcludeChange,
			metaKey,
			onMetaKeyChange,
			metaValue,
			onMetaValueChange,
			metaCompare,
			onMetaCompareChange,
			orderBy,
			onOrderByChange,
			order,
			onOrderChange,
		} = this.props;
		const { showAdvancedFilters } = this.state;
		if ( postType === 'page' ) {
			return ( [
				<SelectControl
					key="post-type"
					className="post-type"
					label={ __( 'Post Type:', 'post-type' ) }
					help="Select a post type for the query."
					value={ postType }
					onChange={ onPostTypeChange }
					options={ window.jmaGlobalObject.post_types.map( type => {
						return { value: type.value, label: type.label };
					} )
					}
				/>,
				onPageChange && (
					<AutocompleteTokenField
						key="Pages"
						tokens={ page || [] }
						onChange={ onPageChange }
						fetchSuggestions={ this.fetchPageSuggestions }
						fetchSavedInfo={ this.fetchSavedPage }
						label={ __( 'Page', 'block-post' ) }
						maxLength={ 1 }
					/>
				),
			] );
		}
		return ( [
			<SelectControl
				key="post-type"
				className="post-type"
				label={ __( 'Post Type:', 'post-type' ) }
				help="Select a post type for the query."
				value={ postType }
				onChange={ onPostTypeChange }
				options={ window.jmaGlobalObject.post_types.map( type => {
					return { value: type.value, label: type.label };
				} )
				}
			/>,
			postType === 'sponsored_content' && IS_SPONSORED_CONTENT_SUPPORTED && (
				<SelectControl
					key="sponsored-content-positions"
					className="sponsored-content"
					label={ __( 'Sponsored Content:', 'sponsored-content' ) }
					help="Select a Sponsored Content position."
					value={ metaValue }
					onChange={ onMetaValueChange }
					options={ window.jmaSponsoredContentGlobalObject.sponsored_content_positions.map( position => {
						return { value: position.value, label: position.label };
					} )
					}
				/>
			),
			postType !== 'sponsored_content' && (
				<RangeControl
					key="post-amount"
					className="postsAmount"
					label="Amount of Posts"
					help="Example: 1"
					value={ postsToShow }
					onChange={ onPostToShowChange }
					initialPosition={ postsToShow } min={ 1 } max={ 20 }
				/>
			),
			onCategoriesChange && onAuthorsChange && postType !== 'sponsored_content' && (
				<p key="toggle-advanced-filters">
					<Button
						isLink
						onClick={ () => this.setState( { showAdvancedFilters: ! showAdvancedFilters } ) }
					>
						{ showAdvancedFilters ?
							__( 'Hide Advanced Filters', 'block-post' ) :
							__( 'Show Advanced Filters', 'block-post' ) }
					</Button>
				</p>
			),
			showAdvancedFilters && onAuthorsChange && postType !== 'sponsored_content' && (
				<AutocompleteTokenField
					key="authors"
					tokens={ authors || [] }
					onChange={ onAuthorsChange }
					fetchSuggestions={ this.fetchAuthorSuggestions }
					fetchSavedInfo={ this.fetchSavedAuthors }
					label={ __( 'Authors', 'block-post' ) }
				/>
			),
			showAdvancedFilters && onCategoriesChange && categoriesExclude.length === 0 && postType !== 'sponsored_content' && (
				<AutocompleteTokenField
					key="categories"
					tokens={ categories || [] }
					onChange={ onCategoriesChange }
					fetchSuggestions={ this.fetchCategorySuggestions }
					fetchSavedInfo={ this.fetchSavedCategories }
					label={ __( 'Categories', 'block-post' ) }
				/>
			),
			showAdvancedFilters && onCategoriesExcludeChange && categories.length === 0 && postType !== 'sponsored_content' && (
				<AutocompleteTokenField
					key="categoriesExclude"
					tokens={ categoriesExclude || [] }
					onChange={ onCategoriesExcludeChange }
					fetchSuggestions={ this.fetchCategorySuggestions }
					fetchSavedInfo={ this.fetchSavedCategories }
					label={ __( 'Categories exclude', 'block-post' ) }
				/>
			),
			showAdvancedFilters && onTagsChange && tagsExclude.length === 0 && postType !== 'sponsored_content' && (
				<AutocompleteTokenField
					key="tags"
					tokens={ tags || [] }
					onChange={ onTagsChange }
					fetchSuggestions={ this.fetchTagSuggestions }
					fetchSavedInfo={ this.fetchSavedTags }
					label={ __( 'Tags', 'block-post' ) }
				/>
			),
			showAdvancedFilters && onTagsExcludeChange && tags.length === 0 && postType !== 'sponsored_content' && (
				<AutocompleteTokenField
					key="tagsExclude"
					tokens={ tagsExclude || [] }
					onChange={ onTagsExcludeChange }
					fetchSuggestions={ this.fetchTagSuggestions }
					fetchSavedInfo={ this.fetchSavedTags }
					label={ __( 'Tags exclude', 'block-post' ) }
				/>
			),
			showAdvancedFilters && postType !== 'sponsored_content' && (
				<TextControl
					key="metaKey"
					label="Custom field Key"
					help="Add the custom field key name"
					value={ metaKey }
					onChange={ onMetaKeyChange }
				/>
			),
			showAdvancedFilters && postType !== 'sponsored_content' && (
				<TextControl
					key="metaValue"
					label="Custom field value"
					help="Add the custom field value"
					value={ metaValue }
					onChange={ onMetaValueChange }
				/>
			),
			showAdvancedFilters && postType !== 'sponsored_content' && (
				<SelectControl
					key="metaCompare"
					className="metacompare"
					label={ __( 'Meta Compare:', '=' ) }
					help="Select a type of comparison for the meta value."
					value={ metaCompare }
					onChange={ onMetaCompareChange }
					options={ [
						{ label: 'Equal', value: '=' },
						{ label: 'Contain', value: 'LIKE' },
					] }
				/>
			),
			showAdvancedFilters && postType !== 'sponsored_content' && (
				<SelectControl
					key="orderby"
					className="orderby"
					label={ __( 'Order by:', 'orderby' ) }
					help="Select a sort for the query."
					value={ orderBy }
					onChange={ onOrderByChange }
					options={ [
						{ label: 'Date', value: 'date' },
						{ label: 'Title', value: 'title' },
						{ label: 'Meta value (string)', value: 'meta_value' },
						{ label: 'Meta value (number)', value: 'meta_value_num' },
					] }
				/>
			),
			showAdvancedFilters && postType !== 'sponsored_content' && (
				<SelectControl
					key="order"
					className="order"
					label={ __( 'Order:', 'order' ) }
					help="Select the order of the sort."
					value={ order }
					onChange={ onOrderChange }
					options={ [
						{ label: 'DESC', value: 'desc' },
						{ label: 'ASC', value: 'asc' },
					] }
				/>
			),
		] );
	}
}
export default QueryPostControls;
