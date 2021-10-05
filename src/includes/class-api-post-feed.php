<?php

class Api_Post_Feed {

    public function get_remote_response( $feed, $feed_query ) {

		// connect to the website endpoint with wp_remote_get() function
		// pass params as URL query args, full parameter list is here https://developer.wordpress.org/rest-api/reference/posts/#arguments
		// at this moment you can use any parameter with Context: View
		// because it would be strange if you can fetch drafts or private posts.

		$response = wp_remote_get( add_query_arg( $feed_query, $feed ) );

		return $response;

	}

	public function get_feed_content_array ( $response_body, $featured_image_crop ) {

		$remote_posts = json_decode( $response_body ); // our posts are here

		foreach( $remote_posts as $key => $remote_post ) {

			$posts_array[$key]['title'] = $remote_post->title->rendered;
			$posts_array[$key]['link'] = $remote_post->link;
			$posts_array[$key]['excerpt'] = strip_tags( $remote_post->excerpt->rendered );

			if( isset( $remote_post->_embedded->{'wp:featuredmedia'} ) ) {
				
				if( isset( $remote_post->_embedded->{'wp:featuredmedia'}[0]->media_details->sizes->$featured_image_crop ) ) {
					$featured_image_src = $remote_post->_embedded->{'wp:featuredmedia'}[0]->media_details->sizes->$featured_image_crop->source_url;
				} else {
					$featured_image_src = 'https://via.placeholder.com/1200x900/000000/FFFFFF/?text=Wrong%20crop%20for%20this%20featured%20image';
				}
				$posts_array[$key]['featured_image']['src'] = $featured_image_src;
				$featured_image_caption = strip_tags( $remote_post->_embedded->{'wp:featuredmedia'}[0]->caption->rendered );
				$posts_array[$key]['featured_image']['caption'] = $featured_image_caption;
				$featured_image_alt_text = strip_tags( $remote_post->_embedded->{'wp:featuredmedia'}[0]->alt_text );
				$posts_array[$key]['featured_image']['alt_text'] = $featured_image_alt_text;
			} else {
				$featured_image_src = 'https://via.placeholder.com/1200x900/000000/FFFFFF/?text=No%20featured%20image%20available%20from%20the%20source';
				$posts_array[$key]['featured_image']['src'] = $featured_image_src;
			}

			if( isset( $remote_post->_embedded->{'author'}[0]->name ) ) {
				$posts_array[$key]['author'] = $remote_post->_embedded->{'author'}[0]->name;
			} else {
				$posts_array[$key]['author'] = $remote_post->_embedded->{'author'}[0]->message;
			}

			$posts_array[$key]['date'] = $remote_post->date;
			$terms = $remote_post->_embedded->{'wp:term'};
			$posts_array[$key]['categories'] = array();
			$posts_array[$key]['tags'] = array();

			foreach ($terms[0] as  $value) {

				$posts_array[$key]['categories'][] .= $value->name;
				
			}

			foreach ($terms[1] as  $value) {

				$posts_array[$key]['tags'][] .= $value->name;

			}

		}

		return $posts_array;

	}
	
}