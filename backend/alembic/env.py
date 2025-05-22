import importlib
import asyncio
from pathlib import Path
import sys
import os

# IMPORTANT: project root directory need to be in PATH
# NOTE: no longer needed in alembic 0.2
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from alembic import context

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from api.core.config import settings
from api.core.database import Base


# import all models
src_path = Path(__file__).parent.parent / "api" / "src"
for path in src_path.rglob("*.py"):
    if path.name != "__init__.py":
        module_path = str(path.relative_to(Path(__file__).parent.parent)).replace(
            os.sep, "."
        )[:-3]
        try:
            importlib.import_module(module_path)
        except Exception as e:
            print(f"Failed to import {module_path}: {e}")

# Alembic Config object
config = context.config

# setup alembic.ini
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# mode Metadata
target_metadata = Base.metadata

def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()
    
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


# run migration
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()