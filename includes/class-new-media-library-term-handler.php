<?php

namespace MediaFilter;

class TermHandler
{
    public static function create(string $parent_term, string $value): int
    {
        $instance = new static;

        $parent_term_id = $instance->getParentTermId($parent_term);
        
        if (!$parent_term_id) {
            $parent_term_id = $instance->createParentTerm($parent_term);
        }

        $term_id = $instance->getTermId($parent_term, $value, $parent_term_id);
        
        if (!$term_id) {
            $term_id = $instance->createTerm($value, $parent_term_id);
        }

        return $term_id;
    }

    protected function getParentTermId(string $parent_term): int
    {
        $parent_term = term_exists($parent_term, 'attachment_meta');

        return $parent_term['term_id'] ?? 0;
    }

    protected function createParentTerm(string $parent_term): int
    {
        $parent_term = wp_insert_term($parent_term, 'attachment_meta');
     
        return $parent_term['term_id'];
    }

    protected function getTermId(string $parent_term, string $value, int $parent_term_id): int
    {
        $term = term_exists($value, 'attachment_meta', $parent_term_id);
        
        return $term['term_id'] ?? 0;
    }

    protected function createTerm(string $value, int $parent_term_id): int
    {
        $term = wp_insert_term($value, 'attachment_meta', ['parent' => $parent_term_id]);
        
        return $term['term_id'];
    }
}
