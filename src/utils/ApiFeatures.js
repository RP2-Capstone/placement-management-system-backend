class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
  if (this.queryString.keyword) {
    this.query = this.query.find({
      companyName: {
        $regex: this.queryString.keyword,
        $options: "i"
      },
      isDeleted: false
    });
  }
  return this;
}


  pagination(resultPerPage = 5) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
