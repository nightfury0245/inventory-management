import tabula
import pandas as pd
import re
import spacy
import json

def clean_table(table):
    table = table.dropna(how='all')
    table = table.applymap(lambda x: x.replace('\t', '').strip() if isinstance(x, str) else x)
    return table

def remove_special_characters(text):
    return re.sub(r'[^A-Za-z0-9 ]+', '', text)

def row_to_single_string(row):
    combined_string = ' '.join(row.dropna().astype(str)).replace('\n', '')
    return remove_special_characters(combined_string)

def extract_and_process_tables_from_pdf(pdf_path):
    tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)
    cleaned_tables = [clean_table(table) for table in tables]
    combined_table = pd.concat(cleaned_tables, ignore_index=True)
    combined_table_as_strings = combined_table.apply(row_to_single_string, axis=1).tolist()
    return combined_table_as_strings

def load_model(model_path):
    return spacy.load(model_path)

def classify_sentence_for_validity(nlp, sentence):
    doc = nlp(sentence)
    return doc.cats

def classify_sentence(nlp, sentence):
    doc = nlp(sentence)
    entities = {ent.label_: ent.text for ent in doc.ents}
    return (sentence, entities)

def extract_classify_and_print_valid_sentences(pdf_path, model_path, entity_model_path):
    processed_sentences = extract_and_process_tables_from_pdf(pdf_path)
    validity_nlp = load_model(model_path)
    entity_nlp = load_model(entity_model_path)
    valid_sentences = []
    for sentence in processed_sentences:
        classification = classify_sentence_for_validity(validity_nlp, sentence)
        if classification.get("VALID", 0.5) >= 0.5:
            valid_sentence, entities = classify_sentence(entity_nlp, sentence)
            valid_sentences.append({"sentence": valid_sentence, "entities": entities})
    valid_sentences_json = json.dumps({"valid_sentences": valid_sentences}, indent=4)
    return valid_sentences_json

if __name__ == "__main__":
    import sys
    pdf_path = sys.argv[1]
    model_path = 'textcat_model'  # Replace with the actual path to your validity classification model
    entity_model_path = './model'  # Replace with the actual path to your entity classification model
    result = extract_classify_and_print_valid_sentences(pdf_path, model_path, entity_model_path)
    print(result)
