

def parse_qrels(filepath):  
    rels_pair = []

    with open(filepath, 'r') as f:
        for line in f:
            line = line.rstrip()
            line = line.split(' ')
            rels_pair.append([line[0], line[1]])
        
    return rels_pair


def parse_query(filepath):
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
                        if not current_field == 'elim':
                            current_doc[current_field] = ' '.join(buffer).strip()
                        
                        
                    documents.append(current_doc)

                current_doc = {"id": int(line.split()[1])}
                current_field = None
                buffer = []

            elif line.startswith('.W'):
                if buffer and current_field:
                    current_doc[current_field] = ' '.join(buffer).strip()
                current_field = 'query'
                buffer = []

            elif line.startswith('.'):
                if buffer and current_field:
                    current_doc[current_field] = ' '.join(buffer).strip()
                current_field = 'elim'
                buffer = []

            else:
                if current_field == 'trash':
                    pass
                else:
                    buffer.append(line)

        if current_doc:
            if buffer and current_field and current_field != 'elim':
                current_doc[current_field] = ' '.join(buffer).strip()
            documents.append(current_doc)

    return documents

if __name__ == '__main__':
    base_path = './dataset/'

    query = parse_query(base_path + 'query.text')
    rels = parse_qrels(base_path + 'qrels.text')

    result = []

    for i in query:
        result.append(f"query {i['id']}  {i['query']}")
    
    result.append('')

    for i in rels:
        result.append(f"rel {i[0]} {i[1]}")

    
    with open('./src/out/output.txt', 'w') as file:
        for item in result:
            file.write(f"{item}\n")