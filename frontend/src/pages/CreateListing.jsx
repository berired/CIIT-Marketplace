function CreateListing() {
  return (
    <section className="create-listing-page">
      <div className="create-listing-header">
        <h1>Create Listing</h1>
        <p>Post an item for other CIIT students to browse and buy.</p>
      </div>

      <div className="create-listing-card">
        <div className="create-listing-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Item Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter item title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                placeholder="Enter price"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category">
                <option>Fashion</option>
                <option>Gadgets</option>
                <option>School Supplies</option>
                <option>Accessories</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select id="condition">
                <option>Brand New</option>
                <option>Like New</option>
                <option>Good Condition</option>
                <option>Pre-loved</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="6"
              placeholder="Describe your item, condition, and other important details"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input id="image" type="file" />
          </div>

          <div className="create-listing-actions">
            <button className="secondary-btn" type="button">
              Save Draft
            </button>
            <button className="primary-btn" type="button">
              Post Listing
            </button>
          </div>
        </div>

        <div className="create-listing-side">
          <div className="listing-tip-card">
            <h2>Listing Tips</h2>
            <p>
              Make your item easier to sell by giving complete and clear details.
            </p>

            <ul className="listing-tip-list">
              <li>Use a short but specific title</li>
              <li>Add the correct condition of the item</li>
              <li>Write an honest description</li>
              <li>Upload a clear image</li>
              <li>Set a reasonable student-friendly price</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateListing