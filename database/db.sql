CREATE DATABASE todo_list;

CREATE TYPE status_enum AS ENUM ('active', 'inactive', 'archived', 'deleted');

CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by UUID, -- could be NULL (self-created)
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by UUID,
        status status_enum DEFAULT 'active'
    );

CREATE TABLE
    social_providers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        provider VARCHAR(50) NOT NULL,
        provider_user_id VARCHAR(255) NOT NULL,
        UNIQUE (provider, provider_user_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by UUID,
        status status_enum DEFAULT 'active'
    );

CREATE TABLE
    tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        owner_id UUID REFERENCES users (id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        due_date DATE,
        priority INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by UUID REFERENCES users (id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by UUID REFERENCES users (id),
        status status_enum DEFAULT 'active'
    );

CREATE TABLE
    task_collaborators (
        task_id UUID REFERENCES tasks (id) ON DELETE CASCADE,
        collaborator_id UUID REFERENCES users (id) ON DELETE CASCADE,
        PRIMARY KEY (task_id, collaborator_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by UUID REFERENCES users (id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by UUID REFERENCES users (id),
        status status_enum DEFAULT 'active'
    );

CREATE TABLE
    tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by UUID REFERENCES users (id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by UUID REFERENCES users (id),
        status status_enum DEFAULT 'active'
    );

    CREATE TABLE task_tags (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    status status_enum DEFAULT 'active'
);


CREATE OR REPLACE FUNCTION set_updated_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;

    -- Optionally preserve updated_by if sent by the app (already set on NEW)
    -- You could enforce app to always supply updated_by via middleware

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_updated_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_fields();

CREATE TRIGGER trg_set_updated_tasks
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_fields();

CREATE TRIGGER trg_set_updated_task_collaborators
BEFORE UPDATE ON task_collaborators
FOR EACH ROW
EXECUTE FUNCTION set_updated_fields();

CREATE TRIGGER trg_set_updated_tags
BEFORE UPDATE ON tags
FOR EACH ROW
EXECUTE FUNCTION set_updated_fields();

CREATE TRIGGER trg_set_updated_task_tags
BEFORE UPDATE ON task_tags
FOR EACH ROW
EXECUTE FUNCTION set_updated_fields();

CREATE TRIGGER trg_set_updated_social_providers
BEFORE UPDATE ON social_providers
FOR EACH ROW
EXECUTE FUNCTION set_updated_fields();