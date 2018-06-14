
#################################################
# Database Setup
#################################################
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///DataSets/belly_button_biodiversity.sqlite"

db = SQLAlchemy(app)

#Database has three tables, do I need to define 3 classes (1 for each table)?
class Otu(db.Model):
    __tablename__ = 'otu'

    otu_id = db.Column(db.Integer, primary_key=True)
    lowest_taxonomic_unit_found = db.Column(db.String(64))

    def __repr__(self):
        return '<otu %r>' % (self.nickname)

class Samples(db.Model):
    __tablename__ = 'otu'

    otu_id = db.Column(db.Integer, primary_key=True)
    lowest_taxonomic_unit_found = db.Column(db.String(64))

    def __repr__(self):
        return '<otu %r>' % (self.nickname)

