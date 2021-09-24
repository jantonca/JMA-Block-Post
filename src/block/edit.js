/* eslint-disable jsx-a11y/anchor-is-valid */
import QueryPostControls from '../components/query-post-controls';
import { invoke, isUndefined, pickBy } from 'lodash';
/**
 * External dependencies
 */
import classNames from 'classnames';
const { dateI18n, __experimentalGetSettings } = wp.date;
const { __, _x } = wp.i18n; // Import __() from wp.i18n
const {
	PanelBody,
	PanelRow,
	ToggleControl,
	Toolbar,
	ButtonGroup,
	Button,
	RangeControl,
	BaseControl,
	Spinner,
	Path,
	SVG,
	TextControl,
} = wp.components;
const {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	RichText,
	PanelColorSettings,
	withColors,
} = wp.blockEditor;
const { Component, Fragment, RawHTML } = wp.element;
const { withSelect } = wp.data;
const { compose } = wp.compose;
const { decodeEntities } = wp.htmlEntities;
let IS_SUBTITLE_SUPPORTED_IN_THEME;
let IS_SPONSORED_CONTENT_SUPPORTED;
import metadata from './block.json';
const { styles } = metadata;

const templates = styles.map( function( style ) {
	return 'is-style-' + style.name;
} );

if (
	typeof window === 'object' &&
	window.intermediaGlobalObject &&
	window.intermediaGlobalObject.subtitle_theme_support
) {
	IS_SUBTITLE_SUPPORTED_IN_THEME = true;
}
if (
	typeof window === 'object' &&
	window.intermediaSponsoredContentGlobalObject &&
	window.intermediaSponsoredContentGlobalObject.sponsored_content_support
) {
	IS_SPONSORED_CONTENT_SUPPORTED = true;
}

/* From https://material.io/tools/icons */
const landscapeIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<Path d="M0 0h24v24H0z" fill="none" />
		<Path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10z" />
	</SVG>
);
const portraitIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<Path d="M0 0h24v24H0z" fill="none" />
		<Path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z" />
	</SVG>
);

const squareIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<Path d="M0 0h24v24H0z" fill="none" />
		<Path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z" />
	</SVG>
);

const uncroppedIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<Path d="M0 0h24v24H0z" fill="none" />
		<Path d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z" />
	</SVG>
);
const coverIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<Path d="M0 0h24v24H0z" fill="none" />
		<Path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z" />
	</SVG>
);
//intermedia-block-post/v1/intermedia-blocks-posts
const dispatch = wp.data.dispatch;
dispatch( 'core' ).addEntities( [
	{
		name: 'intermedia-blocks-posts', // route name
		kind: 'intermedia-blocks-post/v1', // namespace
		baseURL: '/intermedia-block-post/v1/intermedia-blocks-posts', // API path without /wp-json
	},
] );
class Edit extends Component {
	renderFeaturedImage( imageSrc, imageCaption ) {
		const { attributes, textColor } = this.props;
		const { imageShape, displayCaption } = attributes;
		return (
			<figure className="post-thumbnail" key="thumbnail">
				<a href="#" rel="bookmark">
					{ imageSrc && imageShape === 'landscape' && (
						<img src={ imageSrc.landscape } alt="" />
					) }
					{ imageSrc && imageShape === 'portrait' && (
						<img src={ imageSrc.portrait } alt="" />
					) }
					{ imageSrc && imageShape === 'square' && (
						<img src={ imageSrc.square } alt="" />
					) }
					{ imageSrc && imageShape === 'uncropped' && (
						<img src={ imageSrc.uncropped } alt="" />
					) }
					{ ! imageSrc && imageShape === 'landscape' && (
						<img src={ 'https://via.placeholder.com/1200x900/000000/FFFFFF/?text=Featured%20Image' } className="wp-post-image" alt="#" />
					) }
					{ ! imageSrc && imageShape === 'portrait' && (
						<img src={ 'https://via.placeholder.com/600x800/000000/FFFFFF/?text=Featured%20Image' } className="wp-post-image" alt="#" />
					) }
					{ ! imageSrc && imageShape === 'square' && (
						<img src={ 'https://via.placeholder.com/800x800/000000/FFFFFF/?text=Featured%20Image' } className="wp-post-image" alt="#" />
					) }
					{ ! imageSrc && imageShape === 'uncropped' && (
						<img src={ 'https://via.placeholder.com/1200x900/000000/FFFFFF/?text=Featured%20Image' } className="wp-post-image" alt="#" />
					) }
				</a>
				{ displayCaption && '' !== imageCaption && (
					<figcaption style={ { color: textColor.color } } >{ imageCaption }</figcaption>
				) }
			</figure>
		);
	}
	renderExcerpt( post ) {
		const { attributes } = this.props;
		const { excerptLength, excerptReadMore, displayExcerptMore } = attributes;
		let excerpt = post.excerpt.rendered;
		const excerptElement = document.createElement( 'p' );
		excerptElement.innerHTML = excerpt;
		excerpt = excerptElement.textContent || excerptElement.innerText || '';
		const needsReadMore = excerptLength < excerpt.trim().split( ' ' ).length;
		const postExcerpt = needsReadMore ? (
			<Fragment>
				{ excerpt.trim().split( ' ', excerptLength ).join( ' ' ) }
				{ displayExcerptMore && __( ' … ' ) }<a href="#" rel="noopener noreferrer">{ displayExcerptMore && excerptReadMore }</a>
			</Fragment>
		) : (
			excerpt
		);
		return (
			<p>{ postExcerpt }</p>
		);
	}
	renderSubtitle( post ) {
		return (
			<RawHTML
				key="subtitle"
				className="newspack-post-subtitle newspack-post-subtitle--in-homepage-block"
			>
				{ post.meta.newspack_post_subtitle || '' }
			</RawHTML>
		);
	}
	renderAuthor( authorInfo ) {
		const { attributes } = this.props;
		const { displayAuthorAvatar, textColor } = attributes;
		if ( displayAuthorAvatar ) {
			return ( [
				authorInfo.map( author => (
					<span className="avatar author-avatar" key={ author.id }>
						<a className="url fn n" href={ author.author_link }>
							<RawHTML>{ author.avatar }</RawHTML>
						</a>
					</span>
				) ),
				// eslint-disable-next-line react/jsx-key
				<span className="byline">
					{ _x( 'by', 'post author', 'intermedia-blocks' ) }{ ' ' }
					{ authorInfo.reduce( ( accumulator, author, index ) => {
						return [
							...accumulator,
							<span className="author vcard" key={ author.id }>
								<a className={ 'url fn n ' + 'has-' + textColor + '-color' } href={ author.author_link }>
									{ author.display_name }
								</a>
							</span>,
							index < authorInfo.length - 2 && ', ',
							authorInfo.length > 1 && index === authorInfo.length - 2 && _x( ' and ', 'post author', 'intermedia-blocks' ),
						];
					}, [] ) }
				</span>,
			] );
		}
		return (
			<span className="byline">
				{ _x( 'by', 'post author', 'intermedia-blocks' ) }{ ' ' }
				{ authorInfo.reduce( ( accumulator, author, index ) => {
					return [
						...accumulator,
						<span className="author vcard" key={ author.id }>
							<a className={ 'url fn n ' + 'has-' + textColor + '-color' } href={ author.author_link }>
								{ author.display_name }
							</a>
						</span>,
						index < authorInfo.length - 2 && ', ',
						authorInfo.length > 1 && index === authorInfo.length - 2 && _x( ' and ', 'post author', 'intermedia-blocks' ),
					];
				}, [] ) }
			</span>
		);
	}
	renderdate( postDate ) {
		// eslint-disable-next-line no-restricted-syntax
		const dateFormat = __experimentalGetSettings().formats.date;
		return (
			<time className="entry-date published updated" dateTime={ dateI18n( dateFormat, postDate ) }>{ dateI18n( dateFormat, postDate ) }</time>
		);
	}
	alignArticle() {
		const { attributes } = this.props;
		const { contentAlignment } = attributes;
		if ( contentAlignment ) {
			const alignClass = ' content-align-' + contentAlignment;
			return alignClass;
		}
	}
	buildClassesArticle() {
		const { attributes, setAttributes } = this.props;
		const { displayFeaturedImage } = attributes;
		let classItems = 'article-post';
		if ( displayFeaturedImage ) {
			classItems = classItems + ' show-image';
		}
		classItems = classItems + this.alignArticle();
		setAttributes( { classesArticle: classItems } );
		return classItems;
	}
	buildClassesWrapper() {
		const { attributes, setAttributes, className } = this.props;
		const { postType, displayFeaturedImage, imageAlignment, postsView, columnsAmount, textColor, headerColor, fontSize, imageSize } = attributes;
		// const classes =
		// ( className, {
		// 	'is-grid': postsView === 'grid',
		// 	'show-image': displayFeaturedImage,
		// 	[ `columns-${ columnsAmount }` ]: postsView === 'grid',
		// 	//[ `ts-${ typeScale }` ]: typeScale !== '5',
		// 	[ `image-align${ imageAlignment }` ]: displayFeaturedImage,
		// 	//[ `is-${ imageScale }` ]: imageScale !== '1' && displayFeaturedImage,
		// 	//'mobile-stack': mobileStack,
		// 	//[ `is-${ imageShape }` ]: displayFeaturedImage,
		// 	'has-text-color': textColor.color !== '',
		// 	//'show-caption': displayCaption,
		// 	//'show-category': showCategory,
		// 	//wpnbha: true,asdawsd
		// } );
		const classes = classNames( className, {
			[ `is-type-${ postType }` ]: true,
			'is-grid': postsView === 'grid',
			'show-image': displayFeaturedImage,
			[ `columns-${ columnsAmount }` ]: postsView === 'grid',
			[ `ts-${ fontSize }` ]: fontSize !== '5',
			[ `is-image-${ imageAlignment }` ]: displayFeaturedImage,
			[ `is-${ imageSize }` ]: imageSize !== '1' && displayFeaturedImage,
			//'mobile-stack': mobileStack,
			//[ `is-${ imageShape }` ]: displayFeaturedImage,
			'has-header-color': headerColor !== '',
			'has-text-color': textColor !== '',
			//'show-caption': displayCaption,
			//'show-category': showCategory,
			//wpnbha: true,
			'intermedia-post-articles': true,
		} );
		// let classItems = ' intermedia-post-articles is-image-' + imageAlignment;
		// if ( displayFeaturedImage ) {
		// 	classItems = classItems + ' show-image';
		// }
		// classItems = classItems + ' is-' + postsView;
		// if ( gridView ) {
		// 	classItems = classItems + ' columns-' + columnsAmount;
		// }
		setAttributes( { classesContainer: classes } );
		return classes;
	}
	buildInlineStyleArticle() {
		const { attributes } = this.props;
		const { displayFeaturedImage, imageAlignment, StyleInlineArticle } = attributes;
		if ( imageAlignment === 'behind' && displayFeaturedImage ) {
			const style = StyleInlineArticle;
			return style;
		}
	}
	renderPosts() {
		const { attributes, customPosts, textColor, headerColor, setAttributes } = this.props;
		const {
			displayFeaturedImage,
			displayCategory,
			imageAlignment,
			displaySubtitle,
			displayExcerpt,
			displayAuthor,
			displayDate,
			className,
			titleSection,
			template,
			sponsoredContentMessage,
			displaySponsoredContentBadge,
			sponsoredContentBadgeMessage,
			postType,
		} = attributes;
		return (
			customPosts.map( ( post ) => {
				const titleTrimmed = invoke( post, [
					'title',
					'rendered',
					'trim',
				] );
				let featuredMedia = '';
				if ( ! headerColor.color ) {
					headerColor.color = '#1e1e1e';
				}
				if ( post.featured_media ) {
					featuredMedia = ' has-featured-image';
				}
				templates.map( function( templateName ) {
					if ( typeof className !== 'undefined' && className.includes( templateName ) ) {
						setAttributes( { template: templateName } );
					}
				} );
				if ( template === 'is-style-contributor' ) {
					return (
						<article key className={ this.buildClassesArticle() + featuredMedia } style={ this.buildInlineStyleArticle() } >
							{ displayFeaturedImage && imageAlignment === 'behind' && this.renderFeaturedImage( post.intermedia_featured_image_src, post.intermedia_featured_image_caption ) }
							<div className="entry-wrapper" style={ { color: textColor.color } } >
								<div className={ 'entry-meta contributor' } >
									{ displayAuthor && this.renderAuthor( post.intermedia_author_info ) }
									{ displayDate && this.renderdate( post.date_gmt ) }
								</div>
								<div className="content-contributor">
									{ post.intermedia_category_info.length && displayCategory && (
										<div className={ 'cat-links ' + 'has-' + textColor + '-color' } >
											<a href="#">{ decodeEntities( post.intermedia_category_info ) }</a>
										</div>
									) }
									{ RichText.isEmpty( titleSection ) ? (
										<h2 key="title" className={ 'entry-title' } style={ { color: headerColor.color } }>
											<a href="#">{ titleTrimmed }</a>
										</h2>
									) : (
										<h3 key="title" className={ 'entry-title' } style={ { color: headerColor.color } }>
											<a href="#">{ titleTrimmed }</a>
										</h3>
									) }
									{ IS_SUBTITLE_SUPPORTED_IN_THEME && displaySubtitle && (
										this.renderSubtitle( post )
									) }
									{ displayExcerpt && this.renderExcerpt( post ) }
								</div>
							</div>
						</article>
					);
				}
				return (
					<article key className={ this.buildClassesArticle() } style={ this.buildInlineStyleArticle() } >
						{ displayFeaturedImage && this.renderFeaturedImage( post.intermedia_featured_image_src, post.intermedia_featured_image_caption ) }
						<div className="entry-wrapper" style={ { color: textColor.color } } >
							{ IS_SPONSORED_CONTENT_SUPPORTED && displaySponsoredContentBadge && postType === 'sponsored_content' && (
								<div className={ 'sponsored-content-badge' } >
									<span>{ sponsoredContentBadgeMessage }</span>
								</div>
							) }
							{ post.intermedia_category_info.length && displayCategory && (
								<div className={ 'cat-links' } style={ { color: textColor.color } } >
									<a href="#">{ decodeEntities( post.intermedia_category_info ) }</a>
								</div>
							) }
							{ RichText.isEmpty( titleSection ) ? (
								<h2 key="title" className={ 'entry-title' } style={ { color: headerColor.color } }>
									<a href="#">{ titleTrimmed }</a>
								</h2>
							) : (
								<h3 key="title" className={ 'entry-title' } style={ { color: headerColor.color } }>
									<a href="#">{ titleTrimmed }</a>
								</h3>
							) }
							{ IS_SUBTITLE_SUPPORTED_IN_THEME && displaySubtitle && (
								this.renderSubtitle( post )
							) }
							{ displayExcerpt && this.renderExcerpt( post ) }
							<div className={ 'entry-meta' } >
								{ displayAuthor && this.renderAuthor( post.intermedia_author_info ) }
								{ displayDate && this.renderdate( post.date_gmt ) }
							</div>
							{ IS_SPONSORED_CONTENT_SUPPORTED && post.meta.intermedia_sponsored_content.length !== 0 && (
								<div className={ 'entry-meta' } >
									<small>{ sponsoredContentMessage } <span><strong>{ post.meta.intermedia_sponsored_content[ 0 ].name }</strong></span></small>
								</div>
							) }
						</div>
					</article>
				);
			} )
		);
	}
	renderPage() {
		const { attributes, customPosts, isSelected, headerColor, customHeaderColor, textColor, customTextColor } = this.props;
		const { displayPageTitle, displayPageFeaturedImage, displayPageContent } = attributes;
		const displayPage = customPosts;
		return (
			displayPage.map( ( post ) => {
				const titleTrimmed = invoke( post, [
					'title',
					'rendered',
					'trim',
				] );
				let featuredMedia = '';
				if ( post.featured_media ) {
					featuredMedia = ' has-featured-image';
				}
				return (
					<div key="article">
						<article key className={ this.buildClassesArticle() + featuredMedia } style={ this.buildInlineStyleArticle() } >
							{ displayPageFeaturedImage && this.renderFeaturedImage( post.intermedia_featured_image_src, post.intermedia_featured_image_caption ) }
							<div className="entry-wrapper">
								{ displayPageTitle && <h3 className="entry-title">
									<a href="#" rel="bookmark" className={ headerColor + ' has-' + headerColor + '-color' } style={ { color: customHeaderColor } }>
										{ titleTrimmed ? (
											<RawHTML>{ titleTrimmed }</RawHTML>
										) : (
											__( '(no title)' )
										) }
									</a>
								</h3> }
								<div className={ 'entry-content ' + 'has-' + textColor + '-color' } style={ { color: customTextColor } } >
									{ displayPageContent && <RawHTML>{ post.content.rendered }</RawHTML> }
								</div>
							</div>
						</article>
						{ isSelected && <div className="page-banner" >{ 'Content from the Page: ' + titleTrimmed + ' || ID: ' + post.id }</div> }
					</div>
				);
			} )
		);
	}
	renderBlock() {
		const { attributes, isSelected } = this.props;
		const { postType, titleSection } = attributes;
		if ( postType === 'page' ) {
			return (
				<div className={ this.buildClassesWrapper() }>
					<div className={ 'container-box' } data-posts="">
						{ ( isSelected || ! RichText.isEmpty( titleSection ) ) && this.buildHeader() }
						{ this.renderPage() }
					</div>
				</div>
			);
		}
		return (
			<div className={ this.buildClassesWrapper() }>
				<div className={ 'container-box' } data-posts="">
					{ ( isSelected || ! RichText.isEmpty( titleSection ) ) && this.buildHeader() }
					{ this.renderPosts() }
				</div>
			</div>
		);
	}
	buildQueryControls() {
		const { attributes, setAttributes } = this.props;
		const {
			postType,
			page,
			postsAmount,
			authors,
			categories,
			categoriesExclude,
			tags,
			tagsExclude,
			metaKey,
			metaValue,
			metaCompare,
			orderBy,
			order,
			postsView,
			columnsAmount,
		} = attributes;
		return (
			<Fragment>
				<PanelBody title="Display Settings">
					<QueryPostControls
						setAttributes={ setAttributes }
						postType={ postType }
						page={ page }
						onPageChange={ _page => setAttributes( { page: _page } ) }
						onPostTypeChange={ value => setAttributes( { postType: value } ) }
						postsToShow={ postsAmount }
						onPostToShowChange={ value => setAttributes( { postsAmount: value } ) }
						authors={ authors }
						onAuthorsChange={ _authors => setAttributes( { authors: _authors } ) }
						categories={ categories }
						onCategoriesChange={ _categories => setAttributes( { categories: _categories } ) }
						categoriesExclude={ categoriesExclude }
						onCategoriesExcludeChange={ _categoriesExclude => setAttributes( { categoriesExclude: _categoriesExclude } ) }
						tags={ tags }
						onTagsChange={ _tags => setAttributes( { tags: _tags } ) }
						tagsExclude={ tagsExclude }
						onTagsExcludeChange={ _tagsExclude => setAttributes( { tagsExclude: _tagsExclude } ) }
						metaKey={ metaKey }
						onMetaKeyChange={ _metaKey => setAttributes( { metaKey: _metaKey } ) }
						metaValue={ metaValue }
						onMetaValueChange={ _metaValue => setAttributes( { metaValue: _metaValue } ) }
						metaCompare={ metaCompare }
						onMetaCompareChange={ _metaCompare => setAttributes( { metaCompare: _metaCompare } ) }
						orderBy={ orderBy }
						onOrderByChange={ value => setAttributes( { orderBy: value } ) }
						order={ order }
						onOrderChange={ value => setAttributes( { order: value } ) }
					/>
					{ postsView === 'grid' && (
						<RangeControl
							key="columns-amount"
							className="columnsAmount"
							label="Number of columns"
							help="Example: 3"
							value={ columnsAmount }
							onChange={ value => setAttributes( { columnsAmount: value } ) }
							initialPosition={ columnsAmount } min={ 2 } max={ 6 }
						/>
					) }
				</PanelBody>
			</Fragment>
		);
	}
	buildArticleControls() {
		const { attributes, setAttributes } = this.props;
		const { postType, displayFeaturedImage, displayPageTitle, displayPageFeaturedImage, displayPageContent, displayCategory, displayExcerpt, displaySubtitle, displayAuthor, displayAuthorAvatar, displayDate } = attributes;
		if ( postType === 'page' ) {
			return (
				<Fragment>
					<PanelBody title="Page Settings">
						<PanelRow>
							<ToggleControl
								label={ __( 'Display page title' ) }
								checked={ !! displayPageTitle }
								onChange={ () => setAttributes( { displayPageTitle: ! displayPageTitle } ) }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __( 'Display page featured image' ) }
								checked={ !! displayPageFeaturedImage }
								onChange={ () => setAttributes( { displayPageFeaturedImage: ! displayPageFeaturedImage } ) }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __( 'Display content' ) }
								checked={ !! displayPageContent }
								onChange={ () => setAttributes( { displayPageContent: ! displayPageContent } ) }
							/>
						</PanelRow>
					</PanelBody>
				</Fragment>
			);
		}
		return (
			<Fragment>
				<PanelBody title="Article Settings">
					<PanelRow>
						<ToggleControl
							label={ __( 'Display Featured Image' ) }
							checked={ !! displayFeaturedImage }
							onChange={ () => setAttributes( { displayFeaturedImage: ! displayFeaturedImage } ) }
						/>
					</PanelRow>
					{ postType !== 'sponsored_content' && (
						<PanelRow>
							<ToggleControl
								label={ __( 'Display Categories' ) }
								checked={ !! displayCategory }
								onChange={ () => setAttributes( { displayCategory: ! displayCategory } ) }
							/>
						</PanelRow>
					) }
					<PanelRow>
						<ToggleControl
							label={ __( 'Display Author' ) }
							checked={ !! displayAuthor }
							onChange={ () => setAttributes( { displayAuthor: ! displayAuthor } ) }
						/>
					</PanelRow>
					{ displayAuthor && (
						<PanelRow>
							<ToggleControl
								label={ __( 'Display Author Avatar' ) }
								checked={ !! displayAuthorAvatar }
								onChange={ () => setAttributes( { displayAuthorAvatar: ! displayAuthorAvatar } ) }
							/>
						</PanelRow>
					) }
					<PanelRow>
						<ToggleControl
							label={ __( 'Display Date' ) }
							checked={ !! displayDate }
							onChange={ () => setAttributes( { displayDate: ! displayDate } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Display Excerpt' ) }
							checked={ !! displayExcerpt }
							onChange={ () => setAttributes( { displayExcerpt: ! displayExcerpt } ) }
						/>
					</PanelRow>
					{ IS_SUBTITLE_SUPPORTED_IN_THEME && postType !== 'sponsored_content' && (
						<PanelRow>
							<ToggleControl
								label={ __( 'Display Newspack subtitle' ) }
								checked={ !! displaySubtitle }
								onChange={ () => setAttributes( { displaySubtitle: ! displaySubtitle } ) }
							/>
						</PanelRow>
					) }
				</PanelBody>
			</Fragment>
		);
	}
	buildFeaturedImageControls() {
		const { attributes, setAttributes } = this.props;
		const { articleMinHeight, displayCaption, displayFeaturedImage, imageAlignment, imageSize } = attributes;
		const imageSizeOptions = [
			{
				value: 1,
				label: /* translators: label for small size option */ __( '25%', 'block-post' ),
				shortName: /* translators: abbreviation for small size */ __( '25%', 'block-post' ),
			},
			{
				value: 2,
				label: /* translators: label for medium size option */ __( '33%', 'block-post' ),
				shortName: /* translators: abbreviation for medium size */ __( '33%', 'block-post' ),
			},
			{
				value: 3,
				label: /* translators: label for large size option */ __( '50%', 'block-post' ),
				shortName: /* translators: abbreviation for large size */ __( '50%', 'block-post' ),
			},
			{
				value: 4,
				label: /* translators: label for extra large size option */ __( '75%', 'block-post' ),
				shortName: /* translators: abbreviation for extra large size */ __( '75%', 'block-post' ),
			},
		];
		return (
			<Fragment>
				{ displayFeaturedImage &&
					<PanelBody title="Featured Image Settings">
						{ imageAlignment === 'behind' &&
						<PanelRow>
							<RangeControl
								className="articleHeight"
								is-image-left
								help="Sets a minimum height for the block, using a percentage of the screen's current height."
								value={ articleMinHeight }
								onChange={ value => setAttributes( { StyleInlineArticle: { minHeight: value + 'vh', paddingTop: ( value * 0.2 ).toFixed( 1 ) + 'vh' }, articleMinHeight: value } ) }
								initialPosition={ articleMinHeight } min={ 0 } max={ 100 }
							/>
						</PanelRow>
						}
						{ imageAlignment !== 'top' && imageAlignment !== 'behind' && (
							<BaseControl
								label={ __( 'Featured Image Size', 'block-post' ) }
								id="featured-image-size"
							>
								<PanelRow>
									<ButtonGroup
										id="featured-image-size"
										aria-label={ __( 'Featured Image Size', 'block-post' ) }
									>
										{ imageSizeOptions.map( option => {
											const isCurrent = imageSize === option.value;
											return (
												<Button
													isLarge
													isPrimary={ isCurrent }
													aria-pressed={ isCurrent }
													aria-label={ option.label }
													key={ option.value }
													onClick={ () => setAttributes( { imageSize: option.value } ) }
												>
													{ option.shortName }
												</Button>
											);
										} ) }
									</ButtonGroup>
								</PanelRow>
							</BaseControl>
						) }
						<PanelRow>
							<ToggleControl
								label={ __( 'Show Featured Image Caption', 'block-post' ) }
								checked={ displayCaption }
								onChange={ () => setAttributes( { displayCaption: ! displayCaption } ) }
							/>
						</PanelRow>
					</PanelBody>
				}
			</Fragment>
		);
	}
	buildColorSettings() {
		const { textColor, setTextColor, headerColor, setHeaderColor } = this.props;
		return (
			<PanelColorSettings
				title={ __( 'Color Settings', 'block-post' ) }
				initialOpen={ true }
				colorSettings={ [
					{
						value: headerColor.color,
						onChange: setHeaderColor,
						label: __( 'Header Color', 'block-post' ),
					},
					{
						value: textColor.color,
						onChange: setTextColor,
						label: __( 'Text Color', 'block-post' ),
					},
				] }
			/>
		);
	}
	buildFontSize() {
		const { attributes, setAttributes } = this.props;
		const { fontSize } = attributes;
		return (
			<PanelBody title="Font settings">
				<PanelRow>
					<RangeControl
						className="fontSize"
						label="Font size"
						help="Sets the font scale for the article."
						value={ fontSize }
						onChange={ value => setAttributes( { fontSize: value } ) }
						initialPosition={ fontSize } min={ 1 } max={ 10 }
					/>
				</PanelRow>
			</PanelBody>
		);
	}
	buildExcerptControls() {
		const { attributes, setAttributes } = this.props;
		const { displayExcerpt, excerptLength, excerptReadMore, displayExcerptMore } = attributes;
		return (
			<PanelBody title="Excerpt Settings">
				{ displayExcerpt && (
					<RangeControl
						label={ __( 'Max number of words in excerpt' ) }
						value={ excerptLength }
						onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
						min={ 10 }
						max={ 100 }
					/>
				) }
				<PanelRow>
					<ToggleControl
						label={ __( 'Display Read more text' ) }
						checked={ !! displayExcerptMore }
						onChange={ () => setAttributes( { displayExcerptMore: ! displayExcerptMore } ) }
					/>
				</PanelRow>
				{ displayExcerptMore && (
					<PanelRow>
						<TextControl
							key="excerptReadMore"
							label="Read more message"
							help="Add the custom read more message..."
							value={ excerptReadMore }
							onChange={ ( value ) => setAttributes( { excerptReadMore: value } ) }
						/>
					</PanelRow>
				) }
			</PanelBody>
		);
	}
	buildSponsoredControls() {
		const { attributes, setAttributes } = this.props;
		const { sponsoredContentMessage, displaySponsoredContentBadge, sponsoredContentBadgeMessage } = attributes;
		return (
			<PanelBody title="Sponsored Content Settings">
				<PanelRow>
					<ToggleControl
						label={ __( 'Display Sponsored Content Badge' ) }
						checked={ !! displaySponsoredContentBadge }
						onChange={ () => setAttributes( { displaySponsoredContentBadge: ! displaySponsoredContentBadge } ) }
					/>
				</PanelRow>
				{ displaySponsoredContentBadge && (
					<PanelRow>
						<TextControl
							key="sponsorContentBadgeMessage"
							label="Sponsored Content Badge message"
							help="Add the Sponsored Content Badge message..."
							value={ sponsoredContentBadgeMessage }
							onChange={ ( value ) => setAttributes( { sponsoredContentBadgeMessage: value } ) }
						/>
					</PanelRow>
				) }
				<PanelRow>
					<TextControl
						key="sponsoredContentMessage"
						label="Sponsored Content message"
						help="Add the Sponsored Content message..."
						value={ sponsoredContentMessage }
						onChange={ ( value ) => setAttributes( { sponsoredContentMessage: value } ) }
					/>
				</PanelRow>
			</PanelBody>
		);
	}
	// buildTemplateControls() {
	// 	const { attributes, setAttributes } = this.props;
	// 	const { template } = attributes;
	// 	return (
	// 		<PanelBody title="Template Settings">
	// 			<PanelRow>
	// 				<TextControl
	// 					key="templateName"
	// 					label="Template name"
	// 					help="Add the custom template name separated by _"
	// 					value={ template }
	// 					onChange={ ( value ) => setAttributes( { template: value } ) }
	// 				/>
	// 			</PanelRow>

	// 		</PanelBody>
	// 	);
	// }
	renderInspectorControls() {
		const { attributes } = this.props;
		const { postType, displayExcerpt } = attributes;
		return (
			<Fragment>
				{ this.buildQueryControls() }
				{ this.buildArticleControls() }
				{ this.buildFeaturedImageControls() }
				{ postType !== 'page' && this.buildColorSettings() }
				{ postType !== 'page' && this.buildFontSize() }
				{ displayExcerpt && this.buildExcerptControls() }
				{ postType === 'sponsored_content' && this.buildSponsoredControls() }
			</Fragment>
		);
	}
	renderBlockControls() {
		const { attributes, setAttributes } = this.props;
		const { displayFeaturedImage, imageAlignment, imageShape, contentAlignment, postsView } = attributes;
		const blockControls = [
			{
				icon: 'list-view',
				title: __( 'List View', 'intermedia-blocks' ),
				onClick: () => setAttributes( { postsView: 'list' } ),
				isActive: postsView === 'list',
			},
			{
				icon: 'grid-view',
				title: __( 'Grid View', 'intermedia-blocks' ),
				onClick: () => setAttributes( { postsView: 'grid' } ),
				isActive: postsView === 'grid',
			},
		];
		const blockControlsImages = [
			{
				icon: 'align-none',
				title: __( 'Show media on top', 'intermedia-blocks' ),
				isActive: imageAlignment === 'top',
				onClick: () => setAttributes( { imageAlignment: 'top' } ),
			},
			{
				icon: 'align-pull-left',
				title: __( 'Show media on left', 'intermedia-blocks' ),
				isActive: imageAlignment === 'left',
				onClick: () => setAttributes( { imageAlignment: 'left' } ),
			},
			{
				icon: 'align-pull-right',
				title: __( 'Show media on right', 'intermedia-blocks' ),
				isActive: imageAlignment === 'right',
				onClick: () => setAttributes( { imageAlignment: 'right' } ),
			},
			{
				icon: coverIcon,
				title: __( 'Show media behind', 'intermedia-blocks' ),
				isActive: imageAlignment === 'behind',
				onClick: () => setAttributes( { imageAlignment: 'behind' } ),
			},
		];
		const blockControlsImageShape = [
			{
				icon: landscapeIcon,
				title: __( 'Landscape Image Shape', 'intermedia-blocks' ),
				isActive: imageShape === 'landscape',
				onClick: () => setAttributes( { imageShape: 'landscape' } ),
			},
			{
				icon: portraitIcon,
				title: __( 'portrait Image Shape', 'intermedia-blocks' ),
				isActive: imageShape === 'portrait',
				onClick: () => setAttributes( { imageShape: 'portrait' } ),
			},
			{
				icon: squareIcon,
				title: __( 'Square Image Shape', 'intermedia-blocks' ),
				isActive: imageShape === 'square',
				onClick: () => setAttributes( { imageShape: 'square' } ),
			},
			{
				icon: uncroppedIcon,
				title: __( 'Uncropped', 'intermedia-blocks' ),
				isActive: imageShape === 'uncropped',
				onClick: () => setAttributes( { imageShape: 'uncropped' } ),
			},
		];
		return (
			<Fragment>
				<AlignmentToolbar
					value={ contentAlignment }
					onChange={ ( newalign ) => setAttributes( { contentAlignment: newalign } ) }
				/>
				<Toolbar label="FeaturedImage">
					<Toolbar controls={ blockControls } />
					{ displayFeaturedImage && <Toolbar controls={ blockControlsImages } /> }
					{ displayFeaturedImage && imageAlignment !== 'behind' && <Toolbar controls={ blockControlsImageShape } /> }
				</Toolbar>
			</Fragment>
		);
	}
	buildHeader() {
		const { setAttributes, attributes } = this.props;
		const { titleSection } = attributes;
		return (
			<RichText
				onChange={ value => setAttributes( { titleSection: value } ) }
				placeholder={ __( 'Write the header here…', 'block-post' ) }
				value={ titleSection }
				tagName="h2"
				className="article-section-title"
			/>
		);
	}
	render() {
		const { version, customPosts } = this.props;
		// eslint-disable-next-line no-console
		console.log( version );
		const hasPosts = Array.isArray( customPosts ) && customPosts.length;
		if ( ! hasPosts ) {
			return ( [
				<Fragment key="block-controls">
					<BlockControls>{ this.renderBlockControls() }</BlockControls>
					<InspectorControls>{ this.renderInspectorControls() }</InspectorControls>
				</Fragment>,
				<div key="spinner" className={ 'components-image-control is-loading' }>
					{ ! Array.isArray( customPosts ) ? (
						<Spinner />
					) : (
						__( 'No posts found.' )
					) }
				</div>,
			] );
		}
		return ( [
			<Fragment key="block-controls">
				<BlockControls>{ this.renderBlockControls() }</BlockControls>
				<InspectorControls>{ this.renderInspectorControls() }</InspectorControls>
			</Fragment>,
			this.renderBlock(),
		] );
	}
}
export default compose( [
	withColors( { textColor: 'color', headerColor: 'color' } ),
	withSelect( ( select, props ) => {
		const { attributes } = props;
		const { postsAmount, postType, page, categories, categoriesExclude, authors, tags, tagsExclude, metaKey, metaValue, metaCompare, orderBy, order } = attributes;
		let postsQuery = pickBy(
			{
				post_type: postType,
				categories: categories,
				categories_exclude: categoriesExclude,
				author: authors,
				tags: tags,
				per_page: postsAmount,
				tags_exclude: tagsExclude,
				metaKey: metaKey, // filter by metadata
				metaValue: metaValue,
				metaCompare: metaCompare,
				order: order,
				orderby: orderBy,
			},
			( value ) => ! isUndefined( value )
		);
		if ( postType === 'page' ) {
			postsQuery = pickBy(
				{
					per_page: 1,
					post_in: page,
					post_type: postType,
				},
				( value ) => ! isUndefined( value )
			);
		}
		if ( postType === 'sponsored_content' ) {
			postsQuery = pickBy(
				{
					post_type: postType,
					per_page: postsAmount,
					metaKey: 'intermedia_sponsored_content', // filter by metadata
					metaValue: metaValue,
					metaCompare: 'LIKE',
					order: order,
					orderby: orderBy,
				},
				( value ) => ! isUndefined( value )
			);
		}
		if ( orderBy === 'meta_value' || orderBy === 'meta_value_num' ) {
			postsQuery = pickBy(
				{
					categories: categories,
					categories_exclude: categoriesExclude,
					author: authors,
					tags: tags,
					per_page: postsAmount,
					tags_exclude: tagsExclude,
					metaKey: metaKey, // filter by metadata
					metaValue: metaValue,
					metaCompare: metaCompare,
					order: order,
				},
				( value ) => ! isUndefined( value )
			);
		}
		return {
			customPosts: select( 'core' ).getEntityRecords( 'intermedia-blocks-post/v1', 'intermedia-blocks-posts', postsQuery ),
			version: 'Intermedia Block Post // Version: 1.1.0',
		};
	} ),
] )( Edit );
