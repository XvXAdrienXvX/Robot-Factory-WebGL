class Utils {
    static colors = {
        "Red": [1.0, 0.0, 0.0, 1.0],
        "Whitesmoke": [0.96, 0.96, 0.96, 1.0],
        "Blue": [0.0, 0.0, 1.0, 1.0],
         "Lavender_grey": [0.780, 0.772, 0.772, 1.0],
         "grey": [0.520, 0.494, 0.494,1.0],
         "light_grey": [0.810, 0.857, 0.880, 1.0]
    }

    static setColor(defaultColor) {
        return this.colors[defaultColor];
    }
}