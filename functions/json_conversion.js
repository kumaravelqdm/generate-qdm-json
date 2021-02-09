const { uuid } = require('uuidv4');

const convertJson = (json) => {
    let EntityName = json.entity_name;
    let dataTypes = json.dataTypes;
    let table_id = uuid()
    const { entity_type } = json
    let Entity = createEntity({ table_id, title: EntityName, entity_type })
    Entity.fields = createDatatypes(dataTypes, table_id, EntityName)
    return Entity
}


const createDatatypes = (dataTypes, table_id, EntityName) => {
    let list = [];
    Object.keys(dataTypes).map((val, i) => {
        let data = null
        if (Array.isArray(dataTypes[val])) {
            data = createField({ table_name: EntityName, table_id, title: val, isdimension: true, label: dataTypes[val] })
            dataTypes[val].map(child => {
                let childList = createDatatypes(child, table_id, EntityName)
                data.properties.fields = (data.properties && data.properties.fields) ? data.properties.fields : []
                data.properties.fields = [...data.properties.fields, ...childList]
            })
        } else {
            data = createField({ table_name: EntityName, table_id, title: val, isdimension: false, label: dataTypes[val] })
        }
        list.push(data)
    })
    return list;
}

const createField = (props) => {
    return {
        name: props.title,
        properties: {
            datatype: props.isdimension ? null : props.label,
        },
        fieldType: props.isdimension ? 'd' : 'f',
        attributes: {
            id: uuid(),
            tableID: props.table_id,
            table: props.table_name,
            selected_color: null
        }
    }
}

const createEntity = (props) => {
    return {
        entity: props.title,
        status: "draft",
        db_objectname: "merchant_AINQA2",
        entity_group_name: props.type,
        attributes: {
            description: '',
            id: props.table_id,
            type: {
                label: props.entity_type,
                value: props.entity_type
            },
            left: 10,
            top: 10,
            permission: {
                secondary_owner: null,
                primary_owner: null,
            },
            style: {
                color: "red"
            }
        }
    }
}

module.exports = { convertJson }