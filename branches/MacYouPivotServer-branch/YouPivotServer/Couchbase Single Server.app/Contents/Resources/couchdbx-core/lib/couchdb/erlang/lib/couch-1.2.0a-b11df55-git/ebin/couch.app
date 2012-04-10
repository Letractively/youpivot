{application, couch, [
    {description, "Apache CouchDB"},
    {vsn, "1.2.0a-b11df55-git"},
    {modules, []},
    {registered, [
        couch_config,
        couch_db_update,
        couch_db_update_notifier_sup,
        couch_external_manager,
        couch_httpd,
        couch_log,
        couch_primary_services,
        couch_query_servers,
        couch_rep_sup,
        couch_secondary_services,
        couch_server,
        couch_server_sup,
        couch_stats_aggregator,
        couch_stats_collector,
        couch_task_status,
        couch_view
    ]},
    {mod, {couch_app, [
        "/Users/dustin/work/couch/build/etc/couchdb/default.ini",
        "/Users/dustin/work/couch/build/etc/couchdb/local.ini"
    ]}},
    {applications, [kernel, stdlib]},
    {included_applications, [crypto, sasl, inets, oauth, ibrowse, mochiweb]}
]}.