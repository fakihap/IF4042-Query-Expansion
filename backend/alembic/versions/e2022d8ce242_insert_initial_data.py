"""insert initial data

Revision ID: e2022d8ce242
Revises: 1020ca46fe09
Create Date: 2025-05-22 20:01:05.143797

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e2022d8ce242'
down_revision: Union[str, None] = '1020ca46fe09'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute('''
        INSERT INTO documents (id, title, author, content) VALUES 
            (1, 'how to alembic', 'gerg', 'drap documents'),
            (2, 'kinda cool', 'fey!', 'kinda coba2 documents');
    ''')

    op.execute('''
        INSERT INTO queries (id, content, search_result, is_expansion) VALUES 
            (1, 'how to', 0, false),
            (2, 'how to alembic', 0, true);
    ''')

    op.execute('''
        INSERT INTO query_pairs (query_id, expanded_query_id, terms_expanded, scheme_used) VALUES 
            (1, 2, 1, 'LogarithmicTF');
    ''')

    op.execute('''
        INSERT INTO query_results (query_id, document_id, score) VALUES 
            (1, 1, 1);
    ''')


def downgrade() -> None:
    """Downgrade schema."""
    pass
