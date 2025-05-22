  // controllers/PackageController.js
  import PackageModel from "../models/Package.js";
  import User from "../models/User.js";
  import mongoose from "mongoose";
  export class PackageController {

      // Add Package
      static async addPackage(req, res) {
          const {
              packageType,
              price,
              destination,
              travelDate,
              duration,
              numberOfPeople,
              rating,
              description,
              facilities
          } = req.body;

          const user_id = req.user;

          try {
              const user = await User.findById(user_id);
              if (!user || user.role !== 'TourManager') {
                  return res.status(403).json({ message: "Unauthorized access" });
              }

              if (!req.file) {
                  return res.status(400).json({ message: 'No image uploaded' });
              }

              const parsedFacilities = typeof facilities === 'string' ? JSON.parse(facilities) : facilities;

              const newPackage = {
                  packageType,
                  price,
                  description,
                  destination,
                  travelDate,
                  duration,
                  numberOfPeople,
                  rating,
                  facilities: parsedFacilities,
                  image: req.file.path
              };

              const tourManagerPackage = await PackageModel.findOne({ user: user_id });

              if (tourManagerPackage) {
                  tourManagerPackage.package.push(newPackage);
                  await tourManagerPackage.save();
              } else {
                  const newPackageEntry = new PackageModel({
                      user: user_id,
                      package: [newPackage]
                  });
                  await newPackageEntry.save();
              }

              return res.status(201).json({
                  message: "Package created successfully",
                  data: newPackage
              });

          } catch (err) {
              console.error(err);
              return res.status(500).json({ message: "Error creating package", error: err.message });
          }
      }


      // Get packages belonging to the currently logged-in TourManager
      static async getOwnerPackage(req, res) {
          const user_id = req.user._id;

          try {
              const userPackages = await PackageModel.findOne({ user: user_id });

              if (!userPackages || userPackages.package.length === 0) {
                  return res.status(404).json({
                      message: "No packages found for this user",
                      success: false
                  });
              }

              return res.status(200).json({
                  message: "Packages fetched successfully",
                  success: true,
                  data: userPackages.package
              });

          } catch (e) {
              return res.status(500).json({
                  message: "Error fetching packages",
                  error: e.message
              });
          }
      }




      // Delete package handler
      static async deleteOwnerPackage(req, res) {
          const { id } = req.params;
          const user_id = req.user._id;

          if (!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({ message: "Invalid package ID" });
          }

          try {
              const packageToDelete = await PackageModel.updateOne({ user: user_id }, { $pull: { package: { _id: id } } });

              console.log("Package to delete:", packageToDelete);

              if (!packageToDelete) {
                  return res.status(404).json({
                      message: "Package not found or you don't have permission to delete it",
                      success: false
                  });
              }

              return res.status(200).json({
                  message: "Package deleted successfully",
                  success: true
              });

          } catch (e) {
              console.error("Error in deleting package:", e);
              return res.status(500).json({
                  message: "Error deleting package",
                  error: e.message
              });
          }
      }



      // Get All Packages
      static async getPackage(req, res) {
          try {
              const packages = await PackageModel.find();
              return res.status(200).json({ packages });
          } catch (err) {
              return res.status(500).json({ message: "Error fetching packages", error: err.message });
          }
      }

      // Get Specific Package by Type
      static async getSpecificPackage(req, res) {
          const { id } = req.params;
          const { packageType } = req.query;

          try {
              const found = await PackageModel.findById(id);
              if (!found) {
                  return res.status(404).json({ message: "Package not found" });
              }

              const filtered = found.package.filter(pkg => pkg.packageType === packageType);
              return res.status(200).json({ packages: filtered });

          } catch (err) {
              return res.status(500).json({ message: "Failed to get specific package", error: err.message });
          }
      }

      // Update Package Price
      static async updatePackage(req, res) {
          const { price } = req.body;
          const user_id = req.user;
          const { id } = req.params;

          try {
              const user = await User.findById(user_id);
              if (!user || user.role !== 'TourManager') {
                  return res.status(403).json({ message: "Unauthorized" });
              }

              const found = await PackageModel.findById(id);
              if (!found || !found.package || found.package.length === 0) {
                  return res.status(404).json({ message: "Package not found" });
              }

              found.package[0].price = price; // Only updates the first item
              await found.save();

              return res.status(200).json({
                  message: "Package price updated successfully",
                  data: found.package[0]
              });

          } catch (err) {
              return res.status(500).json({ message: "Error updating package", error: err.message });
          }
      }
  }