

module.exports = function (sequelize, DataType) {

    var User = sequelize.define ("User", {

            f_name	        : DataType.STRING ,
            l_name			: DataType.STRING ,
            e_mail			: DataType.STRING ,
            img_url			: DataType.TEXT,
            mobile			: DataType.INTEGER

        },
        {
            paranoid : true,
            classMethods: {
                associate: function (models) {

                }
            }
        });

    return User;
};
