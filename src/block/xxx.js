/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-undef */
{ displayPosts.map( ( post, i ) => {
	const titleTrimmed = invoke( post, [
		'title',
		'rendered',
		'trim',
	] );
	let excerpt = post.excerpt.rendered;
	const currentAuthor = authorList.find(
		( author ) => author.id === post.author
	);

	const excerptElement = document.createElement( 'div' );
	excerptElement.innerHTML = excerpt;

	excerpt =
							excerptElement.textContent ||
							excerptElement.innerText ||
							'';

	const {
		featuredImageInfo: {
			url: imageSourceUrl,
			alt: featuredImageAlt,
		} = {},
	} = post;
	const imageClasses = classnames( {
		'wp-block-latest-posts__featured-image': true,
		[ `align${ featuredImageAlign }` ]: !! featuredImageAlign,
	} );
	const renderFeaturedImage =
							displayFeaturedImage && imageSourceUrl;
	const featuredImage = renderFeaturedImage && (
		<img
			src={ imageSourceUrl }
			alt={ featuredImageAlt }
			style={ {
				maxWidth: featuredImageSizeWidth,
				maxHeight: featuredImageSizeHeight,
			} }
		/>
	);

	const needsReadMore =
							excerptLength <
								excerpt.trim().split( ' ' ).length &&
							post.excerpt.raw === '';

	const postExcerpt = needsReadMore ? (
		<>'							'{ excerpt
			.trim()
			.split( ' ', excerptLength )
			.join( ' ' ) }'							'{ /* translators: excerpt truncation character, default …  */ }'							'{ __( ' … ' ) }'							'<a
				href={ post.link }
				target="_blank"
				rel="noopener noreferrer"
			>
				{ __( 'Read more' ) }
			</a>'						'</>
	) : (
		excerpt
	);

	return (
		<li key={ i }>
			{ renderFeaturedImage && (
				<div className={ imageClasses }>
					{ addLinkToFeaturedImage ? (
						<a
							href={ post.link }
							target="_blank"
							rel="noreferrer noopener"
						>
							{ featuredImage }
						</a>
					) : (
						featuredImage
					) }
				</div>
			) }
			<a
				href={ post.link }
				target="_blank"
				rel="noreferrer noopener"
			>
				{ titleTrimmed ? (
					<RawHTML>{ titleTrimmed }</RawHTML>
				) : (
					__( '(no title)' )
				) }
			</a>
			{ displayAuthor && currentAuthor && (
				<div className="wp-block-latest-posts__post-author">
					{ sprintf(
						/* translators: byline. %s: current author. */
						__( 'by %s' ),
						currentAuthor.name
					) }
				</div>
			) }
			{ displayPostDate && post.date_gmt && (
				<time
					dateTime={ format(
						'c',
						post.date_gmt
					) }
					className="wp-block-latest-posts__post-date"
				>
					{ dateI18n(
						dateFormat,
						post.date_gmt
					) }
				</time>
			) }
			{ displayPostContent &&
									displayPostContentRadio === 'excerpt' && (
				<div className="wp-block-latest-posts__post-excerpt">
					{ postExcerpt }
				</div>
			) }
			{ displayPostContent &&
									displayPostContentRadio === 'full_post' && (
				<div className="wp-block-latest-posts__post-full-content">
					<RawHTML key="html">
						{ post.content.raw.trim() }
					</RawHTML>
				</div>
			) }
		</li>
	);
} ); }
