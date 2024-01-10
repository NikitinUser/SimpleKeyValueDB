# SimpleKeyValueDB

Project just for fun. Key-value database based on file system. Key is name for file in folder NODE_DB_FOLDER. And value is content for this file. Simple tcp server on node.js in server.js. Job observer_ttl.js for deleting expired keys. Simple terminal client in client.js.

## Start server in docker
    sudo make up

## Terminal client
    node client

## Commands
### save_key
    saves `value` in file with name equals `key`
    example for terminal client:
    ``
        save_key key_name value_example
    ``
### get_key
    gets content from file with name equals `key` or return empty string if file not exist
    example for terminal client:
    ``
        get_key key_name
    ``
### delete_key
    deletes file with name equals `key`
    example for terminal client:
    ``
        delete_key key_name
    ``
### all_keys
    returns string with list of all keys separated by `;`
    example for terminal client:
    ``
        all_keys
    ``
### db_size
    returns folders NODE_DB_FOLDER size in MB
### set_ttl
    sets time to live for file with name equals `key` in secons
    ``
        set_ttl key_name 60
    ``
