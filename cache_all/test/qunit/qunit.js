steal
  .plugins("funcunit/qunit",
    'jquery/model',
    'jquery/dom/fixture',
    'jquery/model/list',
    'jquery/model/associations',
    "cache_all")
  .then("cache_all_test");