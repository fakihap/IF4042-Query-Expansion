"""insert initial data

Revision ID: e2022d8ce242
Revises: 1020ca46fe09
Create Date: 2025-05-22 20:01:05.143797

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

import os


# revision identifiers, used by Alembic.
revision: str = 'e2022d8ce242'
down_revision: Union[str, None] = '1020ca46fe09'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

CISI_file_path = os.path.join(os.path.dirname(__file__), "../../dataset/cisi.all")

def parse_cisi_file(filepath):
    documents = []
    current_doc = {}
    current_field = None
    buffer = []

    with open(filepath, 'r') as f:
        for line in f:
            line = line.rstrip()

            if line.startswith('.I'):
                if current_doc:
                    if buffer and current_field:
                        if not current_field == 'references':
                            current_doc[current_field] = '\n'.join(buffer).strip()
                        
                        
                    documents.append(current_doc)

                current_doc = {"id": int(line.split()[1])}
                current_field = None
                buffer = []

            elif line.startswith('.T'):
                if buffer and current_field:
                    current_doc[current_field] = '\n'.join(buffer).strip()
                current_field = 'title'
                buffer = []

            elif line.startswith('.A'):
                if buffer and current_field:
                    current_doc[current_field] = '\n'.join(buffer).strip()
                current_field = 'author'
                buffer = []

            elif line.startswith('.W'):
                if buffer and current_field:
                    current_doc[current_field] = '\n'.join(buffer).strip()
                current_field = 'abstract'
                buffer = []

            elif line.startswith('.X'):
                if buffer and current_field:
                    current_doc[current_field] = '\n'.join(buffer).strip()
                current_field = 'references'
                buffer = []

            else:
                if current_field == 'references':
                    pass
                else:
                    buffer.append(line)

        if current_doc:
            if buffer and current_field and current_field != 'references':
                current_doc[current_field] = '\n'.join(buffer).strip()
            documents.append(current_doc)

    return documents

# if __name__ == '__main__':
    # print(parse_cisi_file(CISI_file_path))
    # for i in parse_cisi_file(CISI_file_path):
        # print(i['id'])
        # break
        # print({"id": i["id"], "title": i["title"], "author": i["author"], "content": i["abstract"]})
        # break


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_bind()

    for i in parse_cisi_file(CISI_file_path):
        conn.execute(
            sa.text("INSERT INTO documents (id, title, author, content) VALUES (:id, :title, :author, :content)"), 
            {"id": i["id"], "title": i["title"], "author": i["author"], "content": i["abstract"]})

    # op.execute('''
    #     INSERT INTO queries (content, search_result, is_expansion) VALUES 
    #         ('test', 0, false),
    #         ('work alembic', 0, true);
    # ''')

    # op.execute('''
    #     INSERT INTO query_pairs (query_id, expanded_query_id, terms_expanded, scheme_used) VALUES 
    #         (1, 2, 1, 'LogarithmicTF');
    # ''')

    # op.execute('''
    #     INSERT INTO query_results (query_id, document_id, score) VALUES 
    #         (1, 1, 1);
    # ''')


def downgrade() -> None:
    """Downgrade schema."""
    # conn = op.get_bind()

    # conn.execute(sa.text('''
    #                      DELETE from documents;
    #                      DELETE from queries;
    #                      DELETE from query_pairs;
    #                      DELETE from query_results;
    #                      '''))
    
    op.execute('''
        TRUNCATE TABLE documents CASCADE;
    ''')

    op.execute('''
        TRUNCATE TABLE queries CASCADE;
    ''')

    op.execute('''
        TRUNCATE TABLE query_results CASCADE;
    ''')

    op.execute('''
        TRUNCATE TABLE query_pairs CASCADE;
    ''')

