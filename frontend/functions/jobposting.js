function extractText(text, extract) {
    let out = []
    for (const [key, value] of Object.entries(extract)) {
        if ((new RegExp(value, "gi")).test(text)) {
            out.push(key)
        }
    }
    return out
}

class JobPosting {
    constructor(id, data) {
        this.Id = id
        this.Title = data["Job Posting Information"]["Job Title"]
        this.Company = data["Company Information"]["Organization"]
        this.Location = data["Job Posting Information"]["Region"]
        this.Summary = data["Summary"]//.join('\n');
    }
    toString() {
        output = ""
        output += `\n---\n`
        output += `## ${this.Title}\n`
        output += `### ${this.Id} - ${this.Company} - ${this.Location}`
        output += `${this.Summary.join('\n')}`
        return output;
    }
}